"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./CopyEmailButton.module.css";

interface CopyEmailButtonProps {
  readonly copiedLabel: string;
  readonly email: string;
  readonly label: string;
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  try {
    textarea.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
  }
}

export function CopyEmailButton({
  copiedLabel,
  email,
  label,
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        didCopy = true;
      } else {
        didCopy = copyWithFallback(email);
      }
    } catch {
      didCopy = copyWithFallback(email);
    }

    if (!didCopy) return;

    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button className={styles.button} type="button" onClick={handleCopy}>
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
