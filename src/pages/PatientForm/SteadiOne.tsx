import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import QuestionTable from "../../components/QuestionTable";

const SteadiOne = ({
  values,
  handleScreeningChange,
  handleFormData,
  nextStep,
  selectedTool,
  setSelectedTool,
}: any) => {
  const keyQuestions = [
    {
      name: "fall_last_year",
      label: "Has the patient fallen in the past year?",
    },
    {
      name: "unsteady",
      label: "Do they feel unsteady when standing or walking?",
    },
    { name: "worry_falling", label: "Do they worry about falling?" },
  ];

  const brochureQuestions = [
    { name: "fallen_past_year", label: "I have fallen in the past year." },
    {
      name: "use_cane_walker",
      label:
        "I use or have been advised to use a cane or walker to get around safely.",
    },
    { name: "unsteady", label: "Sometimes I feel unsteady when I am walking." },
    {
      name: "hold_furniture",
      label: "I steady myself by holding onto furniture when walking at home.",
    },
    { name: "worry_falling", label: "I am worried about falling." },
    {
      name: "push_hand",
      label: "I need to push with my hands to stand up from a chair.",
    },
    {
      name: "trouble_step",
      label: "I have some trouble stepping up onto a curb.",
    },
    { name: "rush_toilet", label: "I often have to rush to the toilet." },
    { name: "lost_feeling", label: "I have lost some feeling in my feet." },
    {
      name: "light_headed",
      label:
        "I take medicine that sometimes makes me feel light-headed or more tired than usual.",
    },
    {
      name: "take_meds",
      label: "I take medicine to help me sleep or improve my mood.",
    },
    { name: "feel_sad", label: "I often feel sad or depressed." },
  ];

  const handleToolSelection = (tool: string) => {
    setSelectedTool(tool);
    handleFormData(
      "steadi_evaluation",
      "screening_tool"
    )({
      target: { value: tool },
    });
  };

  return (
    <>
      <h3>STEADI Fall Risk Screening</h3>
      <Row>
        <Col style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant={selectedTool === "key_questions" ? "primary" : "secondary"}
            onClick={() => handleToolSelection("key_questions")}
          >
            3 Key Questions
          </Button>
          <Button
            variant={selectedTool === "brochure" ? "primary" : "secondary"}
            onClick={() => handleToolSelection("brochure")}
            style={{ marginLeft: "10px" }}
          >
            Stay Independent
          </Button>
        </Col>
      </Row>
      <br />
      {selectedTool === "key_questions" ? (
        <QuestionTable
          questions={keyQuestions}
          values={values}
          handleScreeningChange={handleScreeningChange}
        />
      ) : selectedTool === "brochure" ? (
        <QuestionTable
          questions={brochureQuestions}
          values={values}
          handleScreeningChange={handleScreeningChange}
        />
      ) : (
        <h4 style={{ display: "flex", justifyContent: "center" }}>
          Please select a screening tool
        </h4>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="secondary" onClick={nextStep} disabled={!selectedTool}>
          →
        </Button>
      </div>
    </>
  );
};

export default SteadiOne;
