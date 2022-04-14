class Chat {
    constructor(roomKey, user, containerID, database) {
        this.user = user;
        this.id = roomKey;
        this.database = database;
        this.build_chat(containerID);
    }
    build_chat(containerID) {
        $.tmpl($('#hidden-template'), {id: this.id})
            .appendTo("#"+containerID);
    }
}