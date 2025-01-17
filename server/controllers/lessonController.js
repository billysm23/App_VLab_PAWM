const supabase = require('../config/database');
const AppError = require('../utils/errors/AppError');
const ErrorCodes = require('../utils/errors/errorCodes');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllLessons = asyncHandler(async (req, res, next) => {
    try {
        const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                *
            `)
            .order('order_number');

        if (lessonError) {
            throw new AppError(
                'Failed to fetch lessons',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        const { data: quizResults, error: quizError } = await supabase
            .from('quiz_results')
            .select('lesson_id, score, completed_at')
            .eq('user_id', req.user.id)
            .order('completed_at', { ascending: false });

        if (quizError) {
            throw new AppError(
                'Failed to fetch quiz results',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        const processedLessons = lessons.map(lesson => {
            const lessonResults = quizResults?.filter(r => r.lesson_id === lesson.id) || [];
            const bestScore = lessonResults.length > 0 
                ? Math.max(...lessonResults.map(r => r.score))
                : null;

            let status = 'locked';
            
            if (lesson.order_number === 1) {
                status = lessonResults.length > 0 
                    ? (bestScore >= 60 ? 'completed' : 'attempted')
                    : 'unlocked';
            } else {
                const prevLessonResults = quizResults?.filter(
                    r => r.lesson_id === lesson.id - 1
                ) || [];
                const prevBestScore = prevLessonResults.length > 0
                    ? Math.max(...prevLessonResults.map(r => r.score))
                    : 0;

                if (prevBestScore >= 60) {
                    status = lessonResults.length > 0 
                        ? (bestScore >= 60 ? 'completed' : 'attempted')
                        : 'unlocked';
                }
            }

            return {
                ...lesson,
                prerequisites: lesson.prerequisites?.map(p => p.prerequisite) || [],
                learning_objectives: lesson.learning_objectives?.map(o => o.objective) || [],
                status,
                best_score: bestScore,
                attempts: lessonResults.length
            };
        });

        res.status(200).json({
            success: true,
            data: processedLessons
        });

    } catch (error) {
        next(error);
    }
});

exports.getLessonById = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                *,
                learning_objectives!learning_objectives_lesson_id_fkey(objective),
                prerequisites!prerequisites_lesson_id_fkey(prerequisite),
                topics!topics_lesson_id_fkey(title, description, icon),
                key_concepts!key_concepts_lesson_id_fkey(title, description, example)
            `)
            .eq('id', id)
            .single();

        if (lessonError) {
            throw new AppError(
                'Lesson not found',
                404,
                ErrorCodes.RESOURCE_NOT_FOUND
            );
        }

        let status = 'locked';
        if (lesson.order_number === 1) {
            status = 'unlocked';
        } else {
            const { data: prevResults, error: prevError } = await supabase
                .from('quiz_results')
                .select('score')
                .eq('user_id', req.user.id)
                .eq('lesson_id', lesson.id - 1)
                .gte('score', 60)
                .limit(1);

            if (prevError) {
                throw new AppError(
                    'Failed to check lesson availability',
                    500,
                    ErrorCodes.DATABASE_ERROR
                );
            }

            if (prevResults && prevResults.length > 0) {
                status = 'unlocked';
            } else {
                throw new AppError(
                    'Previous lesson must be completed first',
                    403,
                    ErrorCodes.PREREQUISITE_NOT_MET
                );
            }
        }

        const { data: lessonResults, error: resultsError } = await supabase
            .from('quiz_results')
            .select('score, completed_at')
            .eq('user_id', req.user.id)
            .eq('lesson_id', id)
            .order('completed_at', { ascending: false });

        if (resultsError) {
            console.error('Error fetching lesson results:', resultsError);
        }

        const bestScore = lessonResults && lessonResults.length > 0
            ? Math.max(...lessonResults.map(r => r.score))
            : null;

        if (lessonResults?.length > 0) {
            status = bestScore >= 60 ? 'completed' : 'attempted';
        }

        const formattedLesson = {
            ...lesson,
            learning_objectives: lesson.learning_objectives?.map(o => o.objective) || [],
            prerequisites: lesson.prerequisites?.map(p => p.prerequisite) || [],
            topics: lesson.topics || [],
            key_concepts: lesson.key_concepts || [],
            status,
            best_score: bestScore,
            attempts: lessonResults?.length || 0,
            last_attempt: lessonResults?.[0]?.completed_at || null
        };

        res.status(200).json({
            success: true,
            data: formattedLesson
        });

    } catch (error) {
        next(error);
    }
});