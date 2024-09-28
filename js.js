let peopleData = [];
let charactersData = [];
fetch('data/People.JSON')
    .then(response => response.json())
    .then(data => {
        peopleData = data.people;
        charactersData = data.characters;
        updateTables(); // Update tables when data is ready
    });

function updateTables () {
    const numTables = document.getElementById("tableSlider").value;
    document.getElementById("sliderValue").innerText = numTables;
    const container = document.getElementById("tablesContainer");
    container.innerHTML = '';

    for (let i = 0; i < numTables; i++) {
        let table = createTable(i);
        container.appendChild(table);
    }
};
function createTable(index){
    const table = document.createElement('table');
    table.setAttribute('id', `table_${index}`);
    //Header row
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Person</th><th>Character</th><th>Class</th><th>Validation</th>';
    // Table Rows
    for (let i = 0; i < 4; i++) {
        const row = table.insertRow();
        const personCell = row.insertCell();
        const characterCell = row.insertCell();
        const classCell = row.insertCell();
        const validationCell = row.insertCell();

        classCell.setAttribute('id', `class_${index}_${i}`);

        // Person Dropdown
        const personSelect = createPersonDropdown(index, i);
        personCell.appendChild(personSelect);

        // Character Dropdown (initially empty)
        const characterSelect = document.createElement('select');
        characterSelect.setAttribute('id', `character_${index}_${i}`);
        characterSelect.setAttribute('onchange', `updateClass(${index}, ${i})`);
        characterCell.appendChild(characterSelect);
    }
    //Validation Row IMPORTANT
    const validationRow = table.insertRow();
    const validationCell = validationRow.insertCell();
    validationCell.setAttribute('colspan', '4');
    validationCell.setAttribute('id', `validation_${index}`);
    validationCell.innerText = 'T';

    return table;
}
//Custom User option
function createPersonDropdown(tableIndex, rowIndex) {
    const select = document.createElement('select');
    select.setAttribute('onchange', `updateCharacterDropdown(${tableIndex}, ${rowIndex})`);
    // Default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select Person';
    select.appendChild(defaultOption);
    // Add custom user option
    const customOption = document.createElement('option');
    customOption.value = 'Custom User';
    customOption.text = 'Custom User';
    select.appendChild(customOption);
    // Add people options
    peopleData.forEach(person => {
        const option = document.createElement('option');
        option.value = person.name;
        option.text = person.name;
        select.appendChild(option);
    });

    return select;
}
function updateCharacterDropdown(tableIndex, rowIndex) {
    const personSelect = document.querySelector(`#table_${tableIndex} select`);
    const characterSelect = document.getElementById(`character_${tableIndex}_${rowIndex}`);
    characterSelect.innerHTML = '';
    const selectedPerson = personSelect.value;
    const selectedCharacters = getSelectedCharacters(tableIndex);
    let characterOptions = [];
    // If custom user is selected, show all characters, otherwise show preferred characters first
    if (selectedPerson === 'Custom User') {
        characterOptions = getAllCharacters();
    } else {
        const person = peopleData.find(p => p.name === selectedPerson);
        characterOptions = person.characters.concat(getAllCharacters().filter(c => !person.characters.includes(c)));
    }
    // Filter out already selected characters in the same table
    characterOptions = characterOptions.filter(c => !selectedCharacters.includes(c));
    // Populate the dropdown with filtered character options
    characterOptions.forEach(character => {
        const option = document.createElement('option');
        option.value = character;
        option.text = character;
        characterSelect.appendChild(option);
    });
    // Update class and validate the table
    updateClass(tableIndex, rowIndex);
    validateTable(tableIndex);
}
// Update the class column based on the selected character
function updateClass(tableIndex, rowIndex) {
    const characterSelect = document.getElementById(`character_${tableIndex}_${rowIndex}`);
    const selectedCharacter = characterSelect.value;
    const classCell = document.getElementById(`class_${tableIndex}_${rowIndex}`);
    // Find and display the class of the selected character
    let characterClass = '';
    for (let [category, characters] of Object.entries(charactersData)) {
        if (characters.includes(selectedCharacter)) {
            characterClass = category;
            break;
        }
    }
    classCell.innerText = characterClass;
    validateTable(tableIndex);
}
// Validate the table by ensuring no duplicate characters and valid class limits
function validateTable(tableIndex) {
    const selectedCharacters = getSelectedCharacters(tableIndex);
    const table = document.getElementById(`table_${tableIndex}`);
    let tankCount = 0, mageCount = 0, supportCount = 0;

    for (let i = 0; i < 4; i++) {
        const characterSelect = document.getElementById(`character_${tableIndex}_${i}`);
        const selectedCharacter = characterSelect.value;
        
        if (selectedCharacter === '') continue; // Skip empty rows

        if (selectedCharacters.filter(c => c === selectedCharacter).length > 1) {
            // Duplicate character found
            document.getElementById(`validation_${tableIndex}`).innerText = 'False';
            return;
        }
        // Count class occurrences
        let characterClass = '';
        for (let [category, characters] of Object.entries(charactersData)) {
            if (characters.includes(selectedCharacter)) {
                characterClass = category;
                break;
            }
        }
        if (characterClass === 'Tank') tankCount++;
        if (characterClass === 'Mage') mageCount++;
        if (characterClass === 'Support') supportCount++;
    }
    // Check class limits
    if (tankCount > 1 || mageCount > 1 || supportCount > 1) {
        document.getElementById(`validation_${tableIndex}`).innerText = 'False';
    } else {
        document.getElementById(`validation_${tableIndex}`).innerText = 'T';
    }
}
// Get the currently selected characters for a given table
function getSelectedCharacters(tableIndex) {
    let selectedCharacters = [];
    for (let i = 0; i < 4; i++) {
        const characterSelect = document.getElementById(`character_${tableIndex}_${i}`);
        if (characterSelect.value !== '') {
            selectedCharacters.push(characterSelect.value);
        }
    }
    return selectedCharacters;
}
// Get all available characters from the JSON
function getAllCharacters() {
    let allCharacters = [];
    for (let [category, characters] of Object.entries(charactersData)) {
        allCharacters = allCharacters.concat(characters);
    }
    return allCharacters;
}