import { InvalidTwitchConfigError } from './../models/error.model';
import { validate } from "class-validator";
import { ChatBotConfig } from "./config.model"

export class ConfigValidator {

    public static async readConfig(configPath: string): Promise<ChatBotConfig> {
        var configJson = JSON.parse(require('fs').readFileSync(configPath));

        try {
            console.info("Validating Config...");

            const completeConfig = new ChatBotConfig(
                configJson.twitch.token_endpoint,
                configJson.twitch.username,
                configJson.twitch.client_id,
                configJson.twitch.client_secret,
                configJson.twitch.authorization_code,
                configJson.twitch.channel
            )
            const completeConfigErrors = await validate(completeConfig);

            if (completeConfigErrors.length > 0)
                throw new InvalidTwitchConfigError(`The provided mothership config is not valid, here are the issues: ${completeConfigErrors.join()}`);

            console.info("Config is valid.");
            return completeConfig;

        } catch (error: unknown) {
            if (error instanceof InvalidTwitchConfigError)
                console.log(error.message);
            throw error;
                
        }
    }
}
