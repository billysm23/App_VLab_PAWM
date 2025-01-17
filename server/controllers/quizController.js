const supabase = require('../config/database');
const AppError = require('../utils/errors/AppError');
const ErrorCodes = require('../utils/errors/errorCodes');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllQuizzes = asyncHandler(async (req, res, next) => {
    try {
        console.log('Getting quizzes for user:', req.user.id);

        // Get lesson progress untuk user ini
        const { data: lessonProgress, error: progressError } = await supabase
            .from('lesson_progress')
            .select('lesson_id, status, last_quiz_score')
            .eq('user_id', req.user.id);

        console.log('Progress query result:', { lessonProgress, progressError });

        if (progressError) {
            console.error('Progress error:', progressError);
            throw new AppError(
                'Failed to fetch lesson progress: ' + progressError.message,
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        if (!lessonProgress) {
            // Jika tidak ada progress, inisialisasi untuk lesson pertama
            const { data: firstLesson, error: lessonError } = await supabase
                .from('lessons')
                .select('id')
                .order('order_number', { ascending: true })
                .limit(1)
                .single();

            if (lessonError) {
                console.error('Error getting first lesson:', lessonError);
                throw new AppError(
                    'Failed to get first lesson',
                    500,
                    ErrorCodes.DATABASE_ERROR
                );
            }

            // Insert progress untuk lesson pertama
            const { data: initProgress, error: initError } = await supabase
                .from('lesson_progress')
                .insert([{
                    user_id: req.user.id,
                    lesson_id: firstLesson.id,
                    status: 'unlocked',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }])
                .select();

            if (initError) {
                console.error('Error initializing progress:', initError);
                throw new AppError(
                    'Failed to initialize lesson progress',
                    500,
                    ErrorCodes.DATABASE_ERROR
                );
            }
        }

        // Get all lessons with their quiz counts
        const { data: lessons, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                title,
                order_number,
                quizzes (
                    count
                )
            `)
            .order('order_number');

        console.log('Lessons query result:', { lessons, lessonError });

        if (lessonError) {
            console.error('Lesson error:', lessonError);
            throw new AppError(
                'Failed to fetch lessons: ' + lessonError.message,
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        // Combine lesson data with progress
        const quizData = lessons.map(lesson => {
            const progress = lessonProgress?.find(p => p.lesson_id === lesson.id) || {
                status: lesson.order_number === 1 ? 'unlocked' : 'locked',
                last_quiz_score: null
            };

            return {
                lesson_id: lesson.id,
                lesson_title: lesson.title,
                total_questions: lesson.quizzes?.[0]?.count || 0,
                status: progress.status,
                last_score: progress.last_quiz_score,
                estimated_time: '15'
            };
        });

        console.log('Final quiz data:', quizData);

        res.status(200).json({
            success: true,
            data: quizData
        });
    } catch (error) {
        console.error('Controller error:', error);
        next(new AppError(
            error.message || 'Failed to fetch quizzes',
            500,
            ErrorCodes.DATABASE_ERROR
        ));
    }
});

exports.getQuizByLessonId = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        
        // Validasi lessonId
        if (!lessonId || isNaN(parseInt(lessonId))) {
            throw new AppError(
                'Invalid lesson ID',
                400,
                ErrorCodes.INVALID_INPUT
            );
        }

        console.log('Fetching quiz for lesson:', lessonId); // Debug log

        // Check lesson exists and user has access
        const { data: lessonProgress, error: progressError } = await supabase
            .from('lesson_progress')
            .select('status')
            .eq('user_id', req.user.id)
            .eq('lesson_id', lessonId)
            .single();

        console.log('Lesson progress:', lessonProgress); // Debug log

        if (progressError) {
            console.error('Progress error:', progressError); // Debug log
            throw new AppError(
                'Failed to check lesson access',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        if (!lessonProgress || lessonProgress.status === 'locked') {
            throw new AppError(
                'Quiz is locked or not available',
                403,
                ErrorCodes.UNAUTHORIZED
            );
        }

        // Get lesson title
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('title')
            .eq('id', lessonId)
            .single();

        if (lessonError) {
            console.error('Lesson error:', lessonError); // Debug log
            throw new AppError(
                'Failed to fetch lesson details',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        // Get quiz questions with options
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
            console.error('Questions error:', questionsError); // Debug log
            throw new AppError(
                'Failed to fetch quiz questions',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        console.log('Sending response with questions:', questions.length); // Debug log

        res.status(200).json({
            success: true,
            data: {
                lesson_id: parseInt(lessonId),
                lesson_title: lesson.title,
                questions: questions.map(q => ({
                    id: q.id,
                    question_text: q.question_text,
                    type: q.type,
                    options: q.quiz_options
                }))
            }
        });
    } catch (error) {
        console.error('Quiz fetch error:', error); // Debug log
        next(error);
    }
});

exports.submitQuizResult = asyncHandler(async (req, res, next) => {
    try {
        const { lessonId } = req.params;
        const { score } = req.body;

        if (typeof score !== 'number' || score < 0 || score > 100) {
            throw new AppError(
                'Invalid score value',
                400,
                ErrorCodes.INVALID_INPUT
            );
        }

        // Insert quiz result
        const { error: resultError } = await supabase
            .from('quiz_results')
            .insert([{
                user_id: req.user.id,
                lesson_id: lessonId,
                score: score,
                completed_at: new Date().toISOString()
            }]);

        if (resultError) {
            throw new AppError(
                'Failed to save quiz result',
                500,
                ErrorCodes.DATABASE_ERROR
            );
        }

        res.status(200).json({
            success: true,
            message: 'Quiz result submitted successfully'
        });
    } catch (error) {
        next(error);
    }
});