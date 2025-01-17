const supabase = require('../config/database');
const AppError = require('../utils/errors/AppError');
const ErrorCodes = require('../utils/errors/errorCodes');
const asyncHandler = require('../utils/asyncHandler');

exports.submitQuizResult = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const { score } = req.body;
        const userId = req.user.id;

        console.log('Processing quiz submission:', { lessonId, score, userId });

        // 1. Validasi input
        if (!lessonId || isNaN(parseInt(lessonId))) {
            throw new AppError('Invalid lesson ID', 400, ErrorCodes.INVALID_INPUT);
        }

        if (typeof score !== 'number' || score < 0 || score > 100) {
            throw new AppError('Invalid score value', 400, ErrorCodes.INVALID_INPUT);
        }
        
        const { data: currentLesson, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                order_number,
                title
            `)
            .eq('id', lessonId)
            .single();

        if (lessonError) {
            throw new AppError('Failed to fetch lesson information', 500, ErrorCodes.DATABASE_ERROR);
        }

        const { data: quizResult, error: resultError } = await supabase
            .from('quiz_results')
            .insert([{
                user_id: userId,
                lesson_id: lessonId,
                score: score,
                status: score >= 60 ? 'completed' : 'attempted',
                completed_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (resultError) {
            console.error('Error saving quiz result:', resultError);
            throw new AppError('Failed to save quiz result', 500, ErrorCodes.DATABASE_ERROR);
        }

        const { data: userScores, error: scoresError } = await supabase
            .from('quiz_results')
            .select('score')
            .eq('lesson_id', lessonId)
            .eq('user_id', userId)
            .order('score', { ascending: false })
            .limit(1);

        const bestScore = userScores?.[0]?.score || score;

        res.status(200).json({
            success: true,
            data: {
                message: 'Quiz result submitted successfully',
                currentScore: score,
                bestScore: bestScore,
                passed: score >= 60,
                lessonStatus: score >= 60 ? 'completed' : 'attempted',
                progress: {
                    lessonId: currentLesson.id,
                    lessonTitle: currentLesson.title,
                    orderNumber: currentLesson.order_number
                }
            }
        });

    } catch (error) {
        console.error('Submit quiz error:', error);
        next(error);
    }
});

exports.getAllQuizzes = asyncHandler(async (req, res, next) => {
    try {
        const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                title,
                order_number,
                quizzes (count)
            `)
            .order('order_number');

        if (lessonError) {
            throw new AppError(
                'Failed to fetch lessons',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        const { data: quizResults, error: resultsError } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', req.user.id)
            .order('completed_at', { ascending: false });

        if (resultsError) {
            throw new AppError(
                'Failed to fetch quiz results',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        const quizData = lessons.map(lesson => {
            const lessonResults = quizResults?.filter(r => r.lesson_id === lesson.id) || [];
            const bestScore = lessonResults.length > 0 
                ? Math.max(...lessonResults.map(r => r.score))
                : undefined;
                
            let status = 'locked';
            if (lesson.order_number === 1) {
                status = 'available';
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
                        : 'available';
                }
            }

            return {
                lesson_id: lesson.id,
                lesson_title: lesson.title,
                total_questions: lesson.quizzes[0]?.count || 0,
                status,
                best_score: bestScore,
                attempts: lessonResults.length,
                estimated_time: '15'
            };
        });

        res.status(200).json({
            success: true,
            data: quizData
        });

    } catch (error) {
        next(error);
    }
});

exports.getQuizByLessonId = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        
        if (!lessonId || isNaN(parseInt(lessonId))) {
            throw new AppError('Invalid lesson ID', 400, ErrorCodes.INVALID_INPUT);
        }

        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                title,
                order_number
            `)
            .eq('id', lessonId)
            .single();

        if (lessonError) {
            throw new AppError(
                'Lesson not found',
                404,
                ErrorCodes.RESOURCE_NOT_FOUND
            );
        }

        if (lesson.order_number > 1) {
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

            if (!prevResults || prevResults.length === 0) {
                throw new AppError(
                    'Previous lesson must be completed first',
                    403,
                    ErrorCodes.PREREQUISITE_NOT_MET
                );
            }
        }

        const { data: questions, error: questionsError } = await supabase
            .from('quizzes')
            .select(`
                id,
                question_number,
                question_text,
                type,
                quiz_options (
                    id,
                    text,
                    is_correct
                )
            `)
            .eq('lesson_id', lessonId)
            .order('question_number');

        if (questionsError) {
            throw new AppError(
                'Failed to fetch quiz questions',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        const { data: attempts, error: attemptsError } = await supabase
            .from('quiz_results')
            .select('score, completed_at')
            .eq('user_id', req.user.id)
            .eq('lesson_id', lessonId)
            .order('completed_at', { ascending: false });

        if (attemptsError) {
            console.error('Error fetching attempts:', attemptsError);
        }

        const bestScore = attempts && attempts.length > 0
            ? Math.max(...attempts.map(a => a.score))
            : null;

        res.status(200).json({
            success: true,
            data: {
                lesson_id: parseInt(lessonId),
                lesson_title: lesson.title,
                total_questions: questions.length,
                best_score: bestScore,
                attempts: attempts?.length || 0,
                questions: questions.map(q => ({
                    id: q.id,
                    question_text: q.question_text,
                    type: q.type,
                    options: q.quiz_options
                }))
            }
        });

    } catch (error) {
        next(error);
    }
});