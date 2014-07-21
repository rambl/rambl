angular.module('handleApp.interviewServices', [])

.factory('InterviewQuestions', [
  function () {
    var questions = [
      'Are you the best person for this job? Why?',
      'Are you overqualified for this job?',
      'Describe a difficult experience at work and how you handled it.',
      'Describe yourself.',
      'Describe your best boss and your worst boss.',
      'Describe your career goals.',
      'Describe your work style.',
      'Do you prefer to work alone or on a team?',
      'Do you take work home with you?',
      'Give some examples of teamwork.',
      'Have you ever had difficulty working with a manager?',
      'Have you gotten angry at work? What happened?',
      'How do you handle pressure?',
      'How do you measure success?',
      'How long do you expect to work for this company?',
      'How much do you expect to get paid?',
      'How would you describe the pace at which you work?',
      'How would you describe yourself?',
      'How would you handle it if your boss was wrong?',
      'Is there a type of work environment you prefer?',
      'Is there anything else I can tell you about the job and the company?',
      'Tell me why you want to work here.',
      'What are you looking for in your next position?',
      'What are you passionate about?',
      'What are your goals for the future?',
      'What are your salary requirements?',
      'What can you do for this company?',
      'What can you contribute to this company?',
      'What challenges are you looking for in your next job?',
      'What did you like or dislike about your previous job?',
      'What do you expect from a supervisor?',
      'What do you find are the most difficult decisions to make?',
      'What have you learned from your mistakes?',
      'What interests you about this job?',
      'What is your greatest strength?',
      'What is your greatest weakness?',
      'What major challenges have you handled?',
      'What problems have you encountered at work?',
      'What was your biggest accomplishment (failure) in this position?',
      'What was most (least) rewarding about your job?',
      'What relevant experience do you have?',
      'What will you do if you don\'t get a job offer?',
      'Why are you leaving your job?',
      'Why do you want this job?',
      'Why did you resign?',
      'Why did you quit your job?',
      'Why were you fired?',
      'Why should we hire you?',
      'What do you know about this company?'
  	];

    return {
    	questions: questions
    };
}]);