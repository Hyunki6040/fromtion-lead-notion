import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'w-11 h-6 rounded-full transition-colors duration-200',
              'bg-gray-300 peer-checked:bg-primary-500',
              'peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              className
            )}
          />
          <div
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              'peer-checked:translate-x-5'
            )}
          />
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className="text-sm font-medium text-text-primary">
                {label}
              </span>
            )}
            {description && (
              <p className="text-sm text-text-muted">{description}</p>
            )}
          </div>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch


