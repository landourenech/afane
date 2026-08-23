import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
    group/button
    inline-flex
    flex-row
    shrink-0
    items-center
    justify-center
    gap-1.5
    border-transparent
    bg-clip-padding
    text-sm
    font-medium
    whitespace-nowrap
    transition-all
    outline-none
    select-none
    cursor-pointer
    focus-visible:border-ring
    focus-visible:ring-3
    focus-visible:ring-ring/50
    active:not-aria-[haspopup]:translate-y-px
    disabled:pointer-events-none
    disabled:opacity-50
    aria-invalid:border-destructive
    aria-invalid:ring-3
    aria-invalid:ring-destructive/20
    dark:aria-invalid:border-destructive/50
    dark:aria-invalid:ring-destructive/40
    [&_svg]:pointer-events-none
    [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        default:
          "border-b-2 border-[var(--color-secondary)] text-[var(--color-secondary)]",

        outline:
          "border border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-tertiary)] hover:bg-[var(--color-secondary)] hover:text-[var(--color-primary)]",

        secondary:
          "bg-[var(--color-quaternary)] text-[var(--color-primary)] hover:bg-[var(--color-secondary)]",

        ghost:
          "text-[var(--color-primary)] hover:border-b-2 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",

        destructive:
          "bg-[var(--color-senary)]/10 text-[var(--color-senary)] hover:bg-[var(--color-senary)]/20",

        link:
          "text-[var(--color-secondary)] underline-offset-4 hover:underline",
      },

      size: {
        default: "h-8 px-2.5",

        xs: "h-6 rounded-lg px-2 text-xs",

        sm: "h-7 rounded-lg px-2.5 text-[0.8rem]",

        lg: "h-9 px-2.5",

        icon: "size-8",

        "icon-xs": "size-6 rounded-lg",

        "icon-sm": "size-7 rounded-lg",

        "icon-lg": "size-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
