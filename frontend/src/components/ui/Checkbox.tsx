import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | ReactNode
  description?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className={cn(
                'peer h-5 w-5 rounded border-2 appearance-none cursor-pointer',
                'transition-all duration-200',
                'checked:bg-[var(--project-primary)] checked:border-[var(--project-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--project-primary)] focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error ? 'border-red-500' : 'border-gray-300',
                className
              )}
              {...props}
            />
            <Check className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={props.id}
                className="text-sm font-medium text-text-primary cursor-pointer"
              >
                {label}
                {props.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            {description && (
              <p className="text-sm text-text-muted">{description}</p>
            )}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox


