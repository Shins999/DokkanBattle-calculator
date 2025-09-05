const inputs = document.querySelectorAll(".status input");

let maxVitalityBonus = 0;
let minVitalityBonus = 0;
let SuperSpecialMove = 0;
let StandardSpecialMove = 0;
let StandardSpecialAdditionalEffect = 0;
let SuperSpecialMoveAdditionalEffect = 0;

let Status = 0;
let LeaderSkill = 1;
let AdditionPassive = 1;
let MultiplicationPassive = 1;
let LinkSkill = 1;
let VitalityBonus = 0;
let SpecialMoveAdjustment = 0;
let ActionSkill = 1;
let FieldSkill = 1;
let SupportMemory = 1;
let SupportItem = 1;
let FollowUpCount = 0;

let finalValues = [];

const finalOutput = document.getElementById("values");

function calculateFinal() {
    Status = 0;
    LeaderSkill = 1;
    AdditionPassive = 1;
    MultiplicationPassive = 1;
    LinkSkill = 1;
    ActionSkill = 1;
    FieldSkill = 1;
    SupportMemory = 1;
    SupportItem = 1;
    SpecialMoveAdjustment = 0;

    finalValues = []

    inputs.forEach(input => {
        const key = input.dataset.key;
        const val = Number(input.value) || 0;

        switch (key) {
            case "Status":
                Status = val;
                console.log(val, Status);
                break;
            case "LeaderSkill":
                LeaderSkill += val / 100;
                break;
            case "AdditionPassive":
                AdditionPassive += val / 100;
                break;
            case "MultiplicationPassive":
                MultiplicationPassive += val / 100;
                break;
            case "LinkSkill":
                LinkSkill += val / 100;
                break;
            case "maxVitalityBonus":
                maxVitalityBonus = val;
                break;
            case "minVitalityBonus":
                minVitalityBonus = val;
                break;
            case "SuperSpecialMove":
                SuperSpecialMove = val;
                break;
            case "StandardSpecialMove":
                StandardSpecialMove = val;
                break;
            case "SpecialMoveAdjustment":
                SpecialMoveAdjustment += val;
                break;
            case "StandardSpecialAdditionalEffect":
                StandardSpecialAdditionalEffect = val;
                break;
            case "SuperSpecialMoveAdditionalEffect":
                SuperSpecialMoveAdditionalEffect = val;
                break;
            case "ActionSkill":
                ActionSkill += val / 100;
                break;
            case "FieldSkill":
                FieldSkill += val / 100;
                break;
            case "SupportMemory":
                SupportMemory += val / 100;
                break;
            case "SupportItem":
                SupportItem += val / 100;
                break;
            case "FollowUpCount":
                FollowUpCount = 1 + val;
                break;
        }
    });

    for (let i = 0; i < FollowUpCount; i++) {
        if (i === 0) {
            VitalityBonus = maxVitalityBonus;
            SpecialMoveAdjustment += SuperSpecialMoveAdditionalEffect;
            finalSpecialMoveAdjustment = SuperSpecialMove + SpecialMoveAdjustment;
        } else {
            VitalityBonus = minVitalityBonus;
            SpecialMoveAdjustment += StandardSpecialAdditionalEffect;
            finalSpecialMoveAdjustment = StandardSpecialMove + SpecialMoveAdjustment;
        }

        console.log(Status, LeaderSkill, AdditionPassive, MultiplicationPassive, LinkSkill,
            VitalityBonus, finalSpecialMoveAdjustment, ActionSkill, FieldSkill,
            SupportMemory, SupportItem);

        const finalValue = Status * LeaderSkill * AdditionPassive * MultiplicationPassive * LinkSkill *
            VitalityBonus * finalSpecialMoveAdjustment * ActionSkill * FieldSkill *
            SupportMemory * SupportItem;
        const rounded = Math.round(finalValue);
        finalValues.push(rounded);
    }

    finalOutput.textContent = finalValues.join(", ")
    console.log(finalValues);
}

inputs.forEach(input => input.addEventListener("input", calculateFinal));

calculateFinal();
