/**
 * @file Timezone converter
 * @author Aaron Loz
 * @since 1.0.0
 * @version 1.0.0
 */

// Deconstructing prefix from config file to use in help command
const { prefix } = require("../../config.json");

// Import moment.js for time conversions
const moment = require("moment-timezone");

const { getTimeZones } = require("@vvo/tzdb");

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
    name: "time",
    description: "Converts the provided time from one time zone to another.",
    aliases: ["tz", "timezone"],
    usage: "[command name]",
    cooldown: 5,

    execute(message, args) {
        // If there are no args, it means it needs whole help command.
        if (!args.length) {
            // Reply to the user with the correct usage of the command
            return message.reply({
                content: `You didn't provide any arguments, ${message.author}!\nThe proper usage would be: \`${prefix}tz [time] [timezone]\``,
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        // If argument is provided, check if it's a command.
        if (args.length > 3) {
            args = args.slice(0, 3);
        }

        let time = args[0];
        const yourTz = args[1];
        const targetTz = args[2];

        const { localTime, convertedTime } = convertTime(
            time,
            yourTz.toUpperCase(),
            targetTz.toUpperCase()
        );

        // Reply to the user with the new time
        return message.reply({
            content: `${localTime} in ${yourTz} is ${convertedTime} in ${targetTz}`,
            allowedMentions: {
                repliedUser: false
            }
        });
    },
};

function convertTime(time, sourceZone, targetZone) {
    const sourceTz = getTimeZones().find((tz) => tz.abbreviation === sourceZone).name;

    let currentTzTime;

    if (time === "now") {
        currentTzTime = moment.tz(sourceTz);
    } else {
        currentTzTime = moment.tz(sourceTz).set({ hour: time.split(":")[0], minute: time.split(":")[1] });
    }

    const targetTz = getTimeZones().find((tz) => tz.abbreviation === targetZone).name;

    const targetTzTime = currentTzTime.clone().tz(targetTz);

    const isSourceDst = currentTzTime.isDST();
    const isTargetDst = targetTzTime.isDST();

    if (isSourceDst && !isTargetDst) {
        return {
            localTime: currentTzTime.format("HH:mm"),
            convertedTime: targetTzTime.subtract(60, "minutes").format("HH:mm")
        };
    }

    if (!isSourceDst && isTargetDst) {
        return {
            localTime: currentTzTime.format("HH:mm"),
            convertedTime: targetTzTime.add(60, "minutes").format("HH:mm")
        };
    }

    return {
        localTime: currentTzTime.format("HH:mm"),
        convertedTime: targetTzTime.format("HH:mm")
    };
}