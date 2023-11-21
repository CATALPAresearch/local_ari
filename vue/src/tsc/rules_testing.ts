import {
    //Rules,
    IRule,
    //IRuleCondition,
    //IRuleAction,
    //EActionAugmentation,
    EOperators,
    //ESourceContext,
    ETargetContext,
    ETiming,
    ERuleActor,
    EActionType,
    EActionCategory,
} from "./rules";


export class RulesTesting {
  constructor() {}

  public getAll(){
    return [
        this.rule,
        this.rule_long_absense,
    ];
  }

  // Wie kann ich eine Condition definieren, die je section geprüft wird und je section eine action auslöst?
  // basic example
  public rule: IRule = {
    id: 100,
    is_active: true,
    is_per_section_rule: true,
    title: "Course-Progress",
    Condition: [
      {
        source_context: "mod_assign",
        key: "last_access_days_ago",
        value: 10,
        operator: EOperators.Smaller,
      },
      /*{
                source_context: "mod_quiz",
                key: 'mean_rel_submissions',
                value: 0.5,
                operator: EOperators.Smaller,
            }*/
    ],
    Action: [
      {
        id: 999,
        actor: ERuleActor.StoredPrompt,
        type: EActionType.SCOPE_COURSE,
        section: "",
        category: EActionCategory.TIME_MANAGEMENT,
        action_title: "Titel der Empfehlung",
        action_text:
          "Hallo Herr {user.firstname} {user.lastname}, Sie haben bislang weniger als die Hälfte der Einsende- und Quizaufgaben bearbeitet. ",
        target_context: ETargetContext.COURSE_OVERVIEW_PAGE,
        moodle_course: 2,
        dom_content_selector: ".page-header-headings", //".testbed",//".page-header-headings",
        //dom_indicator_selector: ".completion-item-quiz-6",
        //delay: 1000, // miliseconds
        repetitions: 2,
        timing: ETiming.NOW,
      },
    ],
  };

  public rule_long_absense: IRule = {
    id: 100,
    is_active: true,
    title: "Long course absense, low progress",
    Condition: [
      {
        source_context: "course",
        key: "last_access_days_ago",
        value: 14,
        operator: EOperators.Greater,
      },
      {
        source_context: "mod_assign",
        key: "mean_rel_submissions",
        value: 0.5,
        operator: EOperators.Smaller,
      },
      {
        source_context: "mod_quiz",
        key: "mean_rel_submissions",
        value: 0.5,
        operator: EOperators.Smaller,
      },
    ],
    Action: [
      {
        id: 989,
        section: "",
        actor: ERuleActor.StoredPrompt,
        type: EActionType.SCOPE_COURSE,
        category: EActionCategory.TIME_MANAGEMENT,
        action_title: "Willkommen",
        action_text:
          "Hallo Herr {user.firstname} {user.lastname}, Ihr letzter Besuch im Kurs liegt bereits {lm.course.last_access_days_ago} Tage zurück. Bislang haben Sie {lm.course.relative_progress} % der Aufgaben im Kurs mit einer Erfolgsqoute von {lm.course.relative_success} % bearbeitet. Sie haben dafür insgesamt {lm.course.total_time_spent_hms} Stunden aufgewendet.",
        target_context: ETargetContext.TEST,
        moodle_course: 2,
        dom_content_selector: ".page-header-headings",
        repetitions: 2,
        timing: ETiming.NOW,
      },
    ],
  };
}
