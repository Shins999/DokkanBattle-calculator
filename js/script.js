const inputs = document.querySelectorAll(".status input");

const selector = document.getElementById("statusSelector");
const allStatusDivs = document.querySelectorAll("[data-hide]");

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
let SupportMemoryItem = 1;
let FollowUpCount = 0;

let finalValues = [];

const finalOutput = document.getElementById("values");

function updateVisibility() {
    const selected = selector.value;

    allStatusDivs.forEach(div => {
        if (div.dataset.hide === selected) {
            div.classList.add("hidden");
        } else {
            div.classList.remove("hidden");
        }
    });
}

updateVisibility();

selector.addEventListener("change", () => {
    updateVisibility();

    const visibleInputs = document.querySelectorAll(`.status input:not(.hidden input)`);
    visibleInputs.forEach(input => {
        const key = input.dataset.key;
        if (!key) return;
        switch (key) {
            case "Status":
            case "enemyATK":
                input.value = input.getAttribute("value")
                break;
            case "LeaderSkill":
            case "AdditionPassive":
            case "MultiplicationPassive":
            case "LinkSkill":
            case "ActionSkill":
            case "FieldSkill":
            case "SupportMemory":
            case "SupportItem":
            case "reductionRate":
                input.value = input.getAttribute("value")
                break;
            case "maxVitalityBonus":
            case "minVitalityBonus":
            case "SuperSpecialMove":
            case "StandardSpecialMove":
            case "SpecialMoveAdjustment":
            case "StandardSpecialAdditionalEffect":
            case "SuperSpecialMoveAdditionalEffect":
            case "FollowUpCount":
                input.value = input.getAttribute("value")
                break;
        }
    });

    const allGuard = document.getElementById("allGuard");
    if (allGuard) allGuard.checked = false;
    const effectiveCheckbox = document.getElementById("effectiveCheckbox");
    if (effectiveCheckbox) effectiveCheckbox.checked = false;

    calculateFinal();
});

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
                break;
            case "LeaderSkill":
                LeaderSkill += val / 100;
                break;
            case "FieldSkill":
                FieldSkill += val / 100;
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
            case "SupportMemory":
                SupportMemoryItem += val / 100;
                break;
            case "SupportItem":
                SupportMemoryItem += val / 100;
                break;
            case "FollowUpCount":
                FollowUpCount = 1 + val;
                break;
        }
    });

    finalOutput.innerHTML = "";

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

        let finalValue = Math.floor(Status * LeaderSkill);
        finalValue = Math.floor(finalValue * FieldSkill);
        finalValue = Math.floor(finalValue * AdditionPassive);
        finalValue = Math.floor(finalValue * MultiplicationPassive)
        finalValue = Math.floor(finalValue * SupportMemoryItem);
        finalValue = Math.floor(finalValue * ActionSkill);
        finalValue = Math.floor(finalValue * LinkSkill);
        finalValue = Math.floor(finalValue * VitalityBonus);
        finalValue = Math.round(finalValue * finalSpecialMoveAdjustment);

        finalValues.push(finalValue);

        finalOutput.innerHTML += formatNumberWithUnits(finalValue) + (i < FollowUpCount - 1 ? ", <br>" : "");
    }

    if (selector.value === "ATK") {
        const criticalRateInput = document.getElementById("criticalRate");
        const effectiveCheckbox = document.getElementById("effectiveCheckbox");
        const totalDamageOutput = document.getElementById("totalDamage");

        const criticalRate = Number(criticalRateInput.value) / 100;
        const isEffective = effectiveCheckbox.checked;

        let total = finalValues.reduce((a, b) => a + b, 0);

        if (isEffective) {
            total *= 1.5;
            total *= (1 + 0.25 * criticalRate);
        } else {
            total *= (1 + 0.875 * criticalRate);
        }

        total = Math.round(total);

        totalDamageOutput.innerHTML = formatNumberWithUnits(total);
    }

    if (selector.value === "DEF") {
        const enemyATK = (Number(document.getElementById("enemyATK").value) || 0) * 10000;
        const reductionRate = Number(document.getElementById("reductionRate").value) / 100;
        const allGuard = document.getElementById("allGuard").checked;
        const baseValue = finalValues.reduce((a, b) => a + b, 0); // 実数値の合計


        let damage = enemyATK * (1 - reductionRate);

        if (allGuard) damage *= 0.8;

        damage -= baseValue;

        if (allGuard) damage *= 0.5;

        damage = Math.round(damage);
        if (damage <= 0) damage = 0

        document.getElementById("damageTaken").innerHTML = formatNumberWithUnits(damage);
    }

}

function formatNumberWithUnits(value) {
    if (isNaN(value)) return value;

    if (value >= 100000000) {
        const oku = Math.floor(value / 100000000);
        const man = Math.floor((value % 100000000) / 10000);
        const remainder = value % 10000;

        return `<span class="oku">${oku}</span><span class="oku">億</span>` +
            (man > 0 ? `<span class="man">${man}</span><span class="man">万</span>` : "") +
            (remainder > 0 ? `<span>${remainder}</span>` : "");
    }
    else if (value >= 10000) {
        const man = Math.floor(value / 10000);
        const remainder = value % 10000;
        return `${man}<span class="unit-man">万</span>${remainder > 0 ? remainder : ""}`;
    }
    else {
        return `<span>${value}</span>`;
    }
};

inputs.forEach(input => input.addEventListener("input", calculateFinal));

calculateFinal();
