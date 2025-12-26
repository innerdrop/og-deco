"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    isLoading?: boolean;
    variant?: "destructive" | "default";
    confirmText?: string;
}

export function ConfirmationModal({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    isLoading,
    variant = "default",
    confirmText = "Confirmar",
}: ConfirmationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-serif text-stone-800">{title}</DialogTitle>
                    <DialogDescription className="py-2 text-stone-500">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={variant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white shadow-sm" : "bg-olive hover:bg-olive-dark text-white shadow-sm"}
                        disabled={isLoading}
                    >
                        {isLoading ? "Procesando..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
