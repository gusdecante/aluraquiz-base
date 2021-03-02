/* eslint-disable react/prop-types */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import QuizPage from '../../src/screens/Quiz';

export default function QuizDaGaleraPage(props) {
  const { externalDB } = props;
  return (
    <ThemeProvider theme={externalDB.theme}>
      <QuizPage externalDB={externalDB} />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const [projectName, githubUser] = context.query.id.split('___');
  try {
    const externalDB = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Falha no acesso os dados');
      })
      .then((responseJson) => responseJson);

    console.log(externalDB);
    console.log('Infos que o Next  da para nós', context.query.id);
    return {
      props: {
        externalDB,
      }, // will be passed to the page component as props
    };
  } catch (err) {
    throw new Error(err);
  }
}
