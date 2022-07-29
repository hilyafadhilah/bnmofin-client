import { browser } from "$app/env";
import { goto } from "$app/navigation";
import type { ComponentType } from "svelte";
import { writable } from "svelte/store";
import { AppError } from "../models/error";
import { isTokenError } from "../utils/error";

export interface ToastMessage {
	title?: string;
	message: string;
}

export interface ToastStyleOptions {
	variant?: "solid" | "outline";
	duration?: number;
}

export interface ToastOptions extends ToastMessage, ToastStyleOptions {
	type?: "primary" | "success" | "error";
	icon?: ComponentType;
}

export interface ToastProps extends ToastOptions {
	expire: Date;
}

const defaults = {
	type: "primary" as const,
	variant: "solid" as const,
	duration: 3000,
};

function createToast() {
	const { subscribe, update } = writable<ToastProps[]>([]);

	function push(options: ToastOptions) {
		const expire = new Date();
		expire.setMilliseconds(
			expire.getMilliseconds() + (options.duration ?? defaults.duration)
		);

		const now = new Date();

		update((value) => {
			value.push({
				title: options.title,
				message: options.message,
				duration: options.duration ?? defaults.duration,
				type: options.type ?? defaults.type,
				variant: options.variant ?? defaults.variant,
				expire,
			});

			return value.filter(({ expire }) => expire >= now);
		});
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
			duration: options?.duration ?? defaults.duration * 2,
		});

		if (isTokenError(err) && browser) {
			goto("/logout");
		}
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
