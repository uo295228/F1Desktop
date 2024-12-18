class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8]; 
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)]; 
        this.createStructure();
    }

    createStructure() {
        const mainElement = document.querySelector('main');

       

        
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
         
            mainElement.appendChild(light);
        }

        // Botón de inicio
        const startButton = document.createElement('button');
        startButton.textContent = 'Arranque';
       
        startButton.onclick = () => this.initSequence(startButton);
        mainElement.appendChild(startButton);

        // Botón de reacción
        const reactionButton = document.createElement('button');
        reactionButton.textContent = 'Reacción';
 
        reactionButton.onclick = () => this.stopReaction(reactionButton);
        mainElement.appendChild(reactionButton);

        // Tiempo de reacción
        const reactionTime = document.createElement('p');
     
        
        mainElement.appendChild(reactionTime);
    }

    initSequence(startButton) {
        const mainElement = document.querySelector('main');
        const startButton1 = document.querySelectorAll('button:first-of-type');
    
        startButton1.disabled = true;
    
        mainElement.classList.add('load');  
    
      
    
        setTimeout(() => {
            this.unload_moment = new Date(); 
            console.log("Secuencia de encendido completada.");
    
           
            this.endSequence();
        }, this.lights * 1000 + (this.difficulty * 100));  
    }
    
    endSequence() {
        const reactionButton = document.querySelector('button:nth-of-type(2)');
        const mainElement = document.querySelector('main');
        
        reactionButton.disabled = false;  
    
        
        mainElement.classList.add('unload');
    }

    stopReaction(reactionButton) {
       
        this.clic_moment = new Date(); 

       
        const reactionTime = (this.clic_moment.getTime() - this.unload_moment.getTime()) ;

        
        const reactionDisplay = document.createElement('p');
        
        reactionDisplay.textContent = `Tu tiempo de reacción es: ${reactionTime}ms`;
        document.querySelector('main').appendChild(reactionDisplay);

        // Quitar las clases load y unload de la etiqueta main
        document.querySelector('main').classList.remove('load', 'unload');

        // Deshabilitar el botón de reacción y habilitar el botón de arranque
        reactionButton.disabled = true;
        document.querySelector('button:first-of-type').disabled = false;
     

   

    // Solo crear el formulario si no ha sido creado previamente
    this.createRecordForm(reactionTime);


        }
        createRecordForm(reactionTime) {
            const mainElement = $('main');
            
            // Crear el formulario
            const form = $('<form action="semaforo.php" method="POST"></form>');
            
            // Fila para el campo de nombre
            const nameSection = $('<section></section>');
            const nameLabel = $('<label for="nombre">Nombre:</label>');
            const nameInput = $('<input type="text" id="nombre" name="nombre">');
            nameSection.append(nameLabel);
            nameSection.append(nameInput);
            form.append(nameSection);
            
            // Fila para el campo de apellidos
            const surnameSection = $('<section></section>');
            const surnameLabel = $('<label for="apellidos">Apellidos:</label>');
            const surnameInput = $('<input type="text" id="apellidos" name="apellidos">');
            surnameSection.append(surnameLabel);
            surnameSection.append(surnameInput);
            form.append(surnameSection);
            
            // Fila para el campo de nivel
            const difficultySection = $('<section></section>');
            const difficultyLabel = $('<label for="nivel">Nivel:</label>');
            const difficultyInput = $('<input type="text" id="nivel" name="nivel" value="' + this.difficulty + '">');
            difficultySection.append(difficultyLabel);
            difficultySection.append(difficultyInput);
            form.append(difficultySection);
            
            // Fila para el tiempo de reacción
            const timeSection = $('<section></section>');
            const timeLabel = $('<label for="tiempo">Tiempo de reacción (ms):</label>');
            const timeInput = $('<input type="text" id="tiempo" name="tiempo" value="' + reactionTime + '">');
            timeSection.append(timeLabel);
            timeSection.append(timeInput);
            form.append(timeSection);
            
            // Botón de envío
            const submitButton = $('<button type="submit">Guardar Récord</button>');
            form.append(submitButton);
            
            mainElement.append(form);
            
            // Añadir chequeo de campos vacíos antes de enviar
            form.submit(function(event) {
                if (!nameInput.val() || !surnameInput.val()) {
                    alert("Por favor, completa todos los campos.");
                    event.preventDefault(); // Evitar que el formulario se envíe
                }
            });
        }
        
        
        
}
