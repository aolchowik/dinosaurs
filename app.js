function Human(humanData) {
    this.name = humanData.name;
    this.height = humanData.height;
    this.weight = humanData.weight;
    this.diet = humanData.diet;
    this.units = humanData.units;
    this.fetchHumanData = () => {
        this.name = document.getElementById('name').value;
        this.height = (Number(document.getElementById('feet').value) * 12 + Number(document.getElementById('inches').value))*2.54;
        this.weight = document.getElementById('weight').value;
        this.diet = document.getElementById('diet').value;
    }
}

function Dino(dinosaurData) {
    this.species = dinosaurData.species;
    this.weight = dinosaurData.weight;
    this.height = dinosaurData.height;
    this.diet = dinosaurData.diet;
    this.where = dinosaurData.where;
    this.when = dinosaurData.when;
    this.fact = dinosaurData.fact;
    this.facts = [];
    this.compareDiet = (humanDiet) => {
        return (humanDiet === this.diet) ? 'We have the same diet': 'My diet is different than yours';
    };
    this.compareWeight = (humanWeight) => {
        const weightRatio = (this.weight / humanWeight).toFixed(1);
        return humanWeight === this.weight ?
            'We weight the same'
            :
            (humanWeight > this.weight) ? `You weigh more than ${this.species}` : `${this.species} weighed more than you`
    };
    this.compareHeight = (humanHeight) => {
        return humanHeight === this.height ?
            'We are tall the same'
            :
            (humanHeight > this.height) ? 'You are taller that me.' : 'I am bigger than you';
    }
}

function App() {
    this.dinos = [];
    this.human = new Human({});

    this.setDinos = async () => {
        const dinoJsonData = await getDinosData();

        this.dinos = dinoJsonData.Dinos.map((dinoData) => {
            const newDino = new Dino(dinoData);
            newDino.facts = [
                newDino.fact,
                newDino.compareDiet(this.human.diet),
                newDino.compareWeight(this.human.weight),
                newDino.compareHeight(this.human.height),
                `Lived in ${newDino.when}`,
                `Lived in ${newDino.where}`,
            ];
            return newDino;
        });
    };
    this.createHumanTile = () => {
        const humanDiv = document.createElement("div");
        const gridDiv = document.getElementById('grid');

        humanDiv.className = 'grid-item';
        humanDiv.innerHTML = `
            <h3>${this.human.name}</h3>
            <img src="images/human.png" alt="Human" />`;
        const target = gridDiv.childNodes[4];

        gridDiv.insertBefore(humanDiv, target);
    };
    this.createDinoTile = (dinoData) => {
        const dinoDiv = document.createElement("div");
        const gridDiv = document.getElementById('grid');
        const {
            facts,
            species
        } = dinoData;
        const randomFactId = species === 'Pigeon' ? 0 : Math.floor(Math.random() * 6);

        dinoDiv.className = 'grid-item';

        dinoDiv.innerHTML = `
            <h3>${species}</h3>
            <img src="images/${species.toLowerCase()}.png" alt="${species}" />
            <p>${facts[randomFactId]}</p>`;
        gridDiv.append(dinoDiv);
    };
    this.hideForm = () => {
        const formDiv = document.getElementById('dino-compare');
        formDiv.style.display = 'none';
    };
    this.showTiles = () => {
        this.hideForm();
        const newDiv = document.createElement("div");
        const formDiv = document.getElementById('dino-compare');
        newDiv.innerHTML = "<div id='grid'></div>";
        document.body.insertBefore(newDiv, formDiv);

        this.dinos.map(this.createDinoTile);
        this.createHumanTile();
    }
}

const getDinosData = () => {
    return fetch("./dino.json")
        .then(response => response.json())
        .catch(console.error);
}

const startApp = () => {
    const app =  new App();
    app.human.fetchHumanData();
    const {
        name,
        height,
        weight
    } = app.human;

    const errorMessage = document.getElementById('error');
    if (name === "") {
        errorMessage.innerHTML = '<p>Please enter a name</p>';
        return;
    } else if (height < 1) {
        errorMessage.innerHTML = '<p>Please enter a height more than 0</p>';
        return;
    } else if (weight < 1) {
        errorMessage.innerHTML = '<p>Please enter a weight more than 0</p>';
        return;
    }

    app.setDinos()
        .then(() => {
            console.log('app dinos: ', app);
            app.showTiles();
        })
        .catch(console.error);
}

(function() {
    document.getElementById('btn').addEventListener('click', () => startApp());
})();
