import type { ComponentType } from "svelte";
import { writable } from "svelte/store";
import { AppError } from "../models/error";

export interface ToastMessage {
	title?: string;
	message: string;
}

export interface ToastStyleOptions {
	variant?: "solid" | "outline";
	duration?: number;
}

export interface ToastOptions extends ToastMessage, ToastStyleOptions {
	type?: "success" | "error";
	icon?: ComponentType;
}

function createToast() {
	const { subscribe, update } = writable<ToastOptions[]>([]);

	function push(options: ToastOptions) {
		update((value) => {
			value.push(options);
			return value;
		});

		setTimeout(() => {
			update((value) => {
				value.splice(value.indexOf(options), 1);
				return value;
			});
		}, options.duration ?? 3000);
	}

	function success(options: ToastMessage & ToastStyleOptions) {
		push({
			type: "success",
			...options,
		});
	}

	function error(err: any, options?: ToastStyleOptions) {
		push({
			type: "error",
			title: AppError.getTitle(err),
			message: AppError.getMessage(err),
			variant: options?.variant,
			duration: options?.duration,
		});
	}

	function catchError(options?: ToastStyleOptions) {
		return (err: any) => error(err, options);
	}

	function forwardError(options?: ToastStyleOptions) {
		return (err: any) => {
			error(err, options);
			return Promise.reject(err);
		};
	}

	return {
		subscribe,
		push,
		success,
		error,
		catchError,
		forwardError,
	};
}

export const toast = createToast();
