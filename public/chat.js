class Chat {
    constructor(roomKey, user, containerID, database, ref, push, onChildAdded) {
        this.user = user;
        this.id = roomKey;
        this.database = database;
        this.buildChat(containerID);
        this.ref = ref(this.database, "/messages/"+this.id);
        this.setEvents(push, onChildAdded);
    }
    buildChat(containerID) {
        $.tmpl($('#hidden-template'), {id: this.id})
            .appendTo("#"+containerID);
        
        //Para enviar mensajes
       
    }

    setEvents(push, onChildAdded){
        //Al hacer click en Enviar
        $("#"+this.id).find("form").on("submit", ev => {
            ev.preventDefault();
            let input = $(ev.target).find(".message-content")
            let msg = input.val();
            this.send(msg, push);
            input.val("");
            return false;
        });

        //Evento: al agregar msj a BD, agregar a interfaz
        onChildAdded(this.ref, data => {
            this.add(data);
        })
    }

    add(data){
        let message = data.val();
        let html = `
                    <b>${message.name} : </b>
                    <span>${message.msg}</span>
                    `
        //Creación de li para mensaje
        let $li = $('<li>').addClass('collection-item')
                            .html(html)

        //Agregar el mensaje
        $("#"+this.id).find('.messages').append($li);
    }

    //Agregar el mensaje a la BD
    send(msg, push){
        push(this.ref, {
            name: this.user.displayName || this.user.email,
            roomID: this.id,
            msg: msg
        })
    }

}