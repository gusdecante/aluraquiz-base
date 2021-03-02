/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { css } from '@emotion/react';

import {
  Button, Widget, QuizLogo, QuizBackground, QuizContainer, AlternativesForm,
} from '../../src/components';
import db from '../../db.json';

const loaderCSS = css`
  color: red;
`;

function ResultWidget({ results }) {
  return (
    <>
      <div>
        Página de quiz
      </div>
      <Widget>
        <Widget.Header>
          Tela de Resultado:
        </Widget.Header>

        <Widget.Content>
          <p>
            {`Você acertou ${results.filter((result) => result).length} perguntas` }
          </p>
          <ul>
            {results.map((result, index) => (
              <li key={`result__${result}`}>
                #
                {index + 1}
                {' '}
                Resultado:
                {' '}
                {result === true ? 'Acertou' : 'Errou'}
              </li>
            ))}
          </ul>
        </Widget.Content>
      </Widget>
    </>
  );
}

function LoadingWidget() {
  return (
    <>
      <div>
        Página de quiz
      </div>
      <Widget>
        <Widget.Header>
          Carregando...
        </Widget.Header>

        <Widget.Spinner>
          <ClipLoader size={120} loading color="lightblue" css={loaderCSS} />
        </Widget.Spinner>
      </Widget>
    </>
  );
}

const QuestionWidget = ({
  question, totalQuestions, questionIndex, onSubmit, addResult,
}) => {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = setSelectedAlternative !== undefined;
  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
        alt="Descrição"
      />

      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>

        <AlternativesForm onSubmit={(e) => {
          e.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            setIsQuestionSubmited(false);
            addResult(isCorrect);
            onSubmit();
            setSelectedAlternative(undefined);
          }, 2 * 1000);
        }}
        >

          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const isSelected = selectedAlternative === alternativeIndex;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
                key={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input id={alternativeId} type="radio" style={{ display: 'none' }} name={questionId} onChange={() => setSelectedAlternative(alternativeIndex)} />
                {alternative}
              </Widget.Topic>
            );
          })}
          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>Confirmar</Button>
          {isCorrect && isQuestionSubmited && <p>Você acertou!</p>}
          {!isCorrect && isQuestionSubmited && <p>Você errou!</p>}
        </AlternativesForm>
      </Widget.Content>

    </Widget>
  );
};

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);// Loading
  const [results, setResults] = useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResult(result) {
    setResults([...results, result]);
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  const handleSubmit = () => {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(questionIndex + 1);
    } else {
      setScreenState(screenStates.RESULT);
    }
  };

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            totalQuestions={totalQuestions}
            questionIndex={questionIndex}
            onSubmit={handleSubmit}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
}
