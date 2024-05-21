import { Workbook } from 'exceljs';

const GenExcelResults = ({ data, questions }) => {
  console.log(data);
  const answers = data?.answers ?? [];

  const getQuestionAnswers = (questionId) => {
    return answers
      .map((answer) => {
        const relevantAnswers = answer.answers.filter((a) => a.answers.question === questionId);
        return relevantAnswers.length > 0
          ? { profile: answer.profile, voting_date: answer.voting_date, answers: relevantAnswers }
          : null;
      })
      .filter((item) => item !== null);
  };

  const downloadExcel = async () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    const questionsNames = questions?.map((question) => question.name);
    const headers = ['ФИО', 'Номер студенческого', 'Номер группы', ...questionsNames];

    worksheet.addRow(headers);

    answers.forEach((answer) => {
      const row = [];
      row.push(`${answer.profile.patronymic} ${answer.profile.name} ${answer.profile.surname}`);
      row.push(answer.profile.student_id);
      row.push(answer.profile.group);

      questions.forEach((question) => {
        const questionAnswer = answer.answers.find((a) => a.answers.question === question.id);
        const answerText = questionAnswer
          ? questionAnswer.answers.text
            ? `${questionAnswer.answers.text} (Свободный ответ)`
            : questionAnswer.answers.answer_option
          : '';
        row.push(answerText);
      });

      worksheet.addRow(row);
    });

    headers.forEach((header, index) => {
      worksheet.getColumn(index + 1).width = header.length + 5;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={downloadExcel}>Скачать Excel</button>
    </div>
  );
};

export default GenExcelResults;
