let peopleData = [];
let charactersData = [];
fetch('data/People.JSON')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        peopleData = data.people;
        charactersData = data.characters;
        updateTables();
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
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
    headerRow.innerHTML = '<th>Person</th><th>Character</th><th>Validation</th>';
    // Table Rows
    for (let i = 0; i < 4; i++) {
        const row = table.insertRow();
        const personCell = row.insertCell();
        const characterCell = row.insertCell();
        // Person Dropdown
        const personSelect = createPersonDropdown(index, i);
        personCell.appendChild(personSelect);
        // Character Dropdown (initially empty)
        const characterSelect = document.createElement('select');
        characterSelect.setAttribute('id', `character_${index}_${i}`);
        characterCell.appendChild(characterSelect);
    }
    //Validation Row IMPORTANT
    const validationRow = table.insertRow();
    const validationCell = validationRow.insertCell();
    validationCell.setAttribute('colspan', '3');
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
    if (selectedPerson === 'Custom User') {
        // Populate with all characters
        for (let [category, characters] of Object.entries(charactersData)) {
            characters.forEach(character => {
                const option = document.createElement('option');
                option.value = character;
                option.text = character;
                characterSelect.appendChild(option);
            });
        }
    } else {
        // Populate based on the person
        const person = peopleData.find(p => p.name === selectedPerson);
        person.characters.forEach(character => {
            const option = document.createElement('option');
            option.value = character;
            option.text = character;
            characterSelect.appendChild(option);
        });
    }
}