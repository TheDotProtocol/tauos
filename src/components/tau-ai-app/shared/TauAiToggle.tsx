'use client';

type TauAiToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

/** Figma-faithful toggle — ON: gold track + knob right; OFF: gray track + knob left */
export default function TauAiToggle({ checked, onChange, disabled }: TauAiToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-[24px] w-[44px] shrink-0 rounded-full transition ${
        checked ? 'bg-[#d4a843]' : 'bg-[#333]'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-[3px] size-[18px] rounded-full bg-white shadow transition ${
          checked ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </button>
  );
}
