import { anthropicOAuth } from "./auth/oauth/anthropic.ts";
import { githubCopilotOAuth } from "./auth/oauth/github-copilot.ts";
import { kimiCodingOAuth } from "./auth/oauth/kimi-coding.ts";
import { registerBundledOAuthFlowLoaders } from "./auth/oauth/load.ts";
import { openaiCodexOAuth } from "./auth/oauth/openai-codex.ts";
import { createRadiusOAuth } from "./auth/oauth/radius.ts";
import { xaiOAuth } from "./auth/oauth/xai.ts";

/**
 * Register the OAuth flows that run in a browser.
 *
 * `load.ts` reaches its flow modules through a variable `import()` specifier so
 * bundlers cannot follow it into Node-only code. A web bundler therefore never
 * emits those chunks, and the `import()` fails at runtime against a URL that
 * does not exist — surfacing as "OAuth auth derivation failed for <provider>:
 * Failed to fetch dynamically imported module" the first time a stored token is
 * used. Registering the flows statically means the loader returns them directly
 * and the import is never reached.
 *
 * Every flow is included except OpenRouter's, which needs a `node:http`
 * callback server. It is registered as a thrower rather than omitted so that a
 * caller gets a sentence it can act on instead of a `TypeError` on a missing
 * key.
 *
 * @see registerBunOAuthFlows in `bun-oauth.ts` — same mechanism for standalone
 * Bun binaries, where OpenRouter's flow does work.
 */
export function registerBrowserOAuthFlows(): void {
	registerBundledOAuthFlowLoaders({
		anthropic: () => anthropicOAuth,
		openaiCodex: () => openaiCodexOAuth,
		githubCopilot: () => githubCopilotOAuth,
		kimiCoding: () => kimiCodingOAuth,
		xai: () => xaiOAuth,
		radius: createRadiusOAuth,
		openrouter: () => {
			throw new Error(
				"OpenRouter OAuth needs a local callback server and cannot run in a browser. Use an OpenRouter API key instead.",
			);
		},
	});
}
