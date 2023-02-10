const progressBar = (total, current, size = 40, empty = "▬", line = "▬", slider="🔘") => {
    if (!total) throw new Error('Total value is either not provided or is invalid.');
    if (!current && current !== 0) throw new Error('Current value is either not provided or is invalid.');
    if (isNaN(total)) throw new Error('Total value is not a integer.');
    if (isNaN(current)) throw new Error('Current value is not a integer.');
    if (isNaN(size)) throw new Error('Size value is not a integer.');

    if (current > total) {
        const bar = line.repeat(size + 2);
        const percentage = (current / total) * 100;
        return [bar, percentage];
    } else {
        const pecentage = current/total;
        const progress = Math.round((size * pecentage));
        const emptyProgress = size - progress;
        const lineProgress = line.repeat(progress);
        const progressText = lineProgress.substring(0, lineProgress.length - (line.length)) + slider;
        const emptyProgressText = empty.repeat(emptyProgress);
        const bar = progressText + emptyProgressText;

        return [bar];
    }
};

module.exports = {progressBar};