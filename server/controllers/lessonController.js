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
                *
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

        const processedLessons = lessons.map(lesson => {
            const prerequisites = lesson.prerequisites?.map(p => p.prerequisite) || [];
            
            let status = lesson.status;

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
            console.error('Database query error:', lessonError);
            throw new AppError(
                'Failed to fetch lesson details',
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

        const transformedLesson = {
            ...lesson,
            learning_objectives: lesson.learning_objectives?.map(obj => obj.objective) || [],
            prerequisites: lesson.prerequisites?.map(prereq => prereq.prerequisite) || [],
            topics: lesson.topics || [],
            key_concepts: lesson.key_concepts || []
        };

        const { data: quizResults, error: quizError } = await supabase
            .from('quiz_results')
            .select('score')
            .eq('lesson_id', id)
            .eq('user_id', req.user.id)
            .single();

        if (quizError && quizError.code !== 'PGRST116') {
            console.error('Error checking quiz results:', quizError);
        }

        transformedLesson.quiz_completed = quizResults?.score >= 60 || false;

        res.status(200).json({
            success: true,
            data: transformedLesson
        });

    } catch (error) {
        next(error);
    }
});