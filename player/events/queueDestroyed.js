module.exports = class QueueDestroyed extends Event {
    constructor() {
        super({
            name: "queueDestroyed",
            once: false,
        });
    }
    async exec(queue) {
        // if(queue) {
        //     queue.skipVotes = [];
        // }
    }
};