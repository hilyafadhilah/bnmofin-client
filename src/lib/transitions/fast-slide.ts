import { cubicOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";

export function fastSlide(
	_: HTMLElement,
	{
		duration,
		easing,
		axis,
		direction,
	}: {
		duration?: number;
		easing?: EasingFunction;
		axis: "X" | "Y";
		direction: "+" | "-";
	}
): TransitionConfig {
	return {
		duration,
		easing: easing ?? cubicOut,
		css: (t, u) => {
			return (
				`transform: translate${axis}(${direction}${u * 100}%);` +
				`opacity: ${1 - u};`
			);
		},
	};
}
