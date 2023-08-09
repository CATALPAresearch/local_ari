import * as rules from "../rules";

export class TestRule {

  public getRule():rules.IRule {
    return this.rule;
  }

  public rule: rules.IRule = {
    id: 3,
    active: true,
    title: "Rule 3",
    Condition: [
      {
        context: "quiz_activity",
        key: rules.EConditionCount.count_quiz_attempts,
        value: 0,
        operator: rules.EOperators.Greater,
      }
    ],
    Action: {
      method: rules.ERuleActor.HtmlPrompt,
      text:
        'Sie haben zu oft geklick. Versuchen Sie es mit der Strategie des <a href="#/strategies/fastreading">schnellen Lesens</a>',
      //dom_selector: "#promptplace",
      dom_content_selector: ".prompt.quiz-1",
      moodle_context: rules.EMoodleContext.COURSE_OVERVIEW_PAGE,
      delay: 4000, // miliseconds
      timing: rules.ETiming.WHEN_IDLE,
      //viewport_selector: 'h3.sectionname',
      //viewport_selector: '.ms-headline',
      //timing: ETiming.WHEN_VISIBLE,
      repetitions: 1,
      /**
         *   NOW,
        WHEN_VISIBLE,
        WHEN_IDLE,
         */
    },
  };
}
