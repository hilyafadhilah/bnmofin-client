import { cubicOut } from "svelte/easing";
import type { EasingFunction, TransitionConfig } from "svelte/transition";

type Axis = "x" | "y";
type PrimaryProperty = "width" | "height";
type SecondaryProperty = "top" | "bottom" | "left" | "right";
type CapitalizedSecondaryProperty = "Top" | "Bottom" | "Left" | "Right";

export type DirectedSlideOptions = {
	delay: number;
	duration: number;
	easing: EasingFunction;
	axis: Axis;
};

const defaultOptions: DirectedSlideOptions = {
	delay: 0,
	duration: 400,
	easing: cubicOut,
	axis: "x",
};

export function directedSlide(
	node: Element,
	options: Partial<DirectedSlideOptions> = {}
): TransitionConfig {
	const {
		delay = defaultOptions.delay,
		duration = defaultOptions.duration,
		easing = defaultOptions.easing,
		axis = defaultOptions.axis,
	} = options;

	const style = getComputedStyle(node);
	const opacity = +style.opacity;

	const primary: PrimaryProperty = axis === "y" ? "height" : "width";
	const primaryValue = parseFloat(style[primary]);

	const secondaries: SecondaryProperty[] =
		axis === "y" ? ["top", "bottom"] : ["left", "right"];
	const capitalizedSecondaries: CapitalizedSecondaryProperty[] =
		axis === "y" ? ["Top", "Bottom"] : ["Left", "Right"];

	const paddingStartValue = parseFloat(
		style[`padding${capitalizedSecondaries[0]}`]
	);
	const paddingEndValue = parseFloat(
		style[`padding${capitalizedSecondaries[1]}`]
	);
	const marginStartValue = parseFloat(
		style[`margin${capitalizedSecondaries[0]}`]
	);
	const marginEndValue = parseFloat(
		style[`margin${capitalizedSecondaries[1]}`]
	);
	const borderWidthStartValue = parseFloat(
		style[`border${capitalizedSecondaries[0]}Width`]
	);
	const borderWidthEndValue = parseFloat(
		style[`border${capitalizedSecondaries[1]}Width`]
	);

	return {
		delay,
		duration,
		easing,
		css: (t: number) =>
			"overflow: hidden;" +
			"white-space: nowrap;" +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`${primary}: ${t * primaryValue}px;` +
			`padding-${secondaries[0]}: ${t * paddingStartValue}px;` +
			`padding-${secondaries[1]}: ${t * paddingEndValue}px;` +
			`margin-${secondaries[0]}: ${t * marginStartValue}px;` +
			`margin-${secondaries[1]}: ${t * marginEndValue}px;` +
			`border-${secondaries[0]}-width: ${t * borderWidthStartValue}px;` +
			`border-${secondaries[1]}-width: ${t * borderWidthEndValue}px;`,
	};
}
