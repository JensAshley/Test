import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import MedicationTable from "../../components/MedicationTable";
import MentalHealthTable from "../../components/MentalHealthTable";

const highRiskMedications = [
  "Benzodiazepines (e.g., Diazepam)",
  "Antidepressants (e.g., Amitriptyline)",
  "Antihypertensives (e.g., Lisinopril)",
  "Opioid analgesics (e.g., Oxycodone)",
  "Sedatives or Hypnotics (e.g., Zolpidem)",
  "Diuretics (e.g., Furosemide)",
  "Mood Stabilizers and Anticonvulsants (e.g., Valproic Acid)",
  "Antipsychotics (e.g., Haloperidol)",
  "Anticholinergics (e.g., Diphenhydramine)",
  "Muscle Relaxants (e.g., Cyclobenzaprine)",
  "Antiparkinsonian agents (e.g., Levodopa)",
  "Other",
];

const mentalHealthConditions = [
  "Depression",
  "Anxiety",
  "Bipolar Disorder",
  "Demetia",
  "Schizophrenia",
  "Fear of Falling",
  "Post-Traumatic Stress Disorder (PTSD)",
  "Panic Disorder",
  "Social Anxiety Disorder",
  "Generalized Anxiety Disorder (GAD)",
  "Eating Disorders",
  "Other",
];

const SteadiTwo = ({
  values,
  handleFormData,
  fallRiskAssessment,
  prevStep,
}: any) => {
  const [medicationDetails, setMedicationDetails] = useState(
    values.medication_details || []
  );
  const [mentalHealthDetails, setMentalHealthDetails] = useState(
    values.mental_health_details || []
  );

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    type: "medication" | "mentalHealth",
    details: any[],
    setDetails: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const selectedItems = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    const existingSet = new Set(
      details.map(
        (detail: any) =>
          detail[type === "medication" ? "medication" : "condition"]
      )
    );

    const updatedDetails = [...details];

    selectedItems.forEach((item) => {
      if (!existingSet.has(item)) {
        updatedDetails.push(
          type === "medication"
            ? {
                medication: item === "Other" ? "" : item,
                dose: "",
                frequency: "",
                startDate: "",
                comments: "",
              }
            : {
                condition: item === "Other" ? "" : item,
                diagnosisDate: "",
                comments: "",
              }
        );
      }
    });

    setDetails(updatedDetails);
  };

  const handleDetailChange = (
    type: "medication" | "mentalHealth",
    index: number,
    field: string,
    value: string
  ) => {
    const updatedDetails =
      type === "medication" ? [...medicationDetails] : [...mentalHealthDetails];
    updatedDetails[index][field] = value;
    type === "medication"
      ? setMedicationDetails(updatedDetails)
      : setMentalHealthDetails(updatedDetails);
    handleFormData(
      "steadi_evaluation",
      type === "medication" ? "medication_details" : "mental_health_details"
    )({
      target: { value: updatedDetails },
    });
  };

  return (
    <>
      <h3>STEADI Assessment</h3>
      {/* Fall Risk Score Selection */}
      <h5>Gait, Strength, & Balance Evaluation</h5>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Select an assessment</Form.Label>
            <Form.Select
              value={values.risk_assess}
              onChange={handleFormData("steadi_evaluation", "risk_assess")}
            >
              <option value="">Select...</option>
              {fallRiskAssessment.map((assessment: string, index: number) => (
                <option key={index} value={assessment}>
                  {assessment}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Risk Score</Form.Label>
            <Form.Control
              type="number"
              defaultValue={values.risk_score}
              onChange={handleFormData("steadi_evaluation", "risk_score")}
            />
          </Form.Group>
        </Col>
      </Row>
      <h5>Medications</h5>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Select medications</Form.Label>
            <Form.Select
              multiple
              defaultValue={values.medication || []}
              onChange={(e) =>
                handleSelectChange(
                  e,
                  "medication",
                  medicationDetails,
                  setMedicationDetails
                )
              }
            >
              {highRiskMedications.map((medication: string, index: number) => (
                <option key={index} value={medication}>
                  {medication}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <MedicationTable
        medicationDetails={medicationDetails}
        handleDetailChange={handleDetailChange}
      />
      <h5>Mental Health Conditions</h5>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Select mental health conditions</Form.Label>
            <Form.Select
              multiple
              defaultValue={values.mental_health || []}
              onChange={(e) =>
                handleSelectChange(
                  e,
                  "mentalHealth",
                  mentalHealthDetails,
                  setMentalHealthDetails
                )
              }
            >
              {mentalHealthConditions.map(
                (condition: string, index: number) => (
                  <option key={index} value={condition}>
                    {condition}
                  </option>
                )
              )}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <MentalHealthTable
        mentalHealthDetails={mentalHealthDetails}
        handleDetailChange={handleDetailChange}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button variant="secondary" onClick={prevStep}>
          ←
        </Button>
      </div>
    </>
  );
};

export default SteadiTwo;
