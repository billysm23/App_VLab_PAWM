const supabase = require('../config/database');
const AppError = require('../utils/errors/AppError');
const ErrorCodes = require('../utils/errors/errorCodes');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllLessons = asyncHandler(async (req, res, next) => {
    try {
        // Get lessons with their prerequisites
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select(`
                *,
                prerequisites (prerequisite),
                learning_objectives (objective),
                topics (title, description, icon)
            `)
            .order('order_number');

        if (error) {
            throw new AppError(
                'Failed to fetch lessons',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        // Get user's quiz results to determine lesson status
        const { data: quizResults, error: quizError } = await supabase
            .from('quiz_results')
            .select('lesson_id, score')
            .eq('user_id', req.user.id);

        if (quizError) {
            console.error('Error fetching quiz results:', quizError);
        }

        // Process lessons to include prerequisites as array and check status
        const processedLessons = lessons.map(lesson => {
            const prerequisites = lesson.prerequisites?.map(p => p.prerequisite) || [];
            
            // Check if previous lesson's quiz was completed successfully
            let status = lesson.status;
            if (lesson.order_number > 1) {
                const prevLessonId = lessons.find(l => l.order_number === lesson.order_number - 1)?.id;
                const prevQuizResult = quizResults?.find(qr => qr.lesson_id === prevLessonId);
                
                if (!prevQuizResult || prevQuizResult.score < 60) {
                    status = 'locked';
                }
            }

            return {
                ...lesson,
                prerequisites,
                learning_objectives: lesson.learning_objectives?.map(lo => lo.objective) || [],
                topics: lesson.topics || [],
                status
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

        const { data: lesson, error } = await supabase
            .from('lessons')
            .select(`
                *,
                prerequisites (prerequisite),
                learning_objectives (objective),
                topics (title, description, icon),
                key_concepts (title, description, example)
            `)
            .eq('id', id)
            .single();

        if (error) {
            throw new AppError(
                'Failed to fetch lesson',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        if (!lesson) {
            throw new AppError(
                'Lesson not found',
                404,
                ErrorCodes.RESOURCE_NOT_FOUND
            );
        }

        // Process lesson data
        const processedLesson = {
            ...lesson,
            prerequisites: lesson.prerequisites?.map(p => p.prerequisite) || [],
            learning_objectives: lesson.learning_objectives?.map(lo => lo.objective) || [],
            topics: lesson.topics || [],
            key_concepts: lesson.key_concepts || []
        };

        res.status(200).json({
            success: true,
            data: processedLesson
        });
    } catch (error) {
        next(error);
    }
});