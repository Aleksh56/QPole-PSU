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

    data?.forEach(({ fullName, studentNumber, groupNumber, question1, question2 }) => {
      worksheet.addRow([fullName, studentNumber, groupNumber, question1, question2]);
    });

    headers.forEach((header, index) => {
      worksheet.getColumn(index + 1).eachCell((cell) => {
        const column = worksheet.getColumn(index + 1);
        column.width = Math.max(column.width, cell.value ? cell.value.toString().length + 5 : 10);
      });
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
