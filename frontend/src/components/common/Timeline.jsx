import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Timeline({ steps, className }) {
  return (
    <div className={cn('relative', className)}>
      {steps.map((step, index) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="relative flex gap-6 pb-12 last:pb-0"
        >
          {index < steps.length - 1 && (
            <div className="absolute left-5 top-10 h-full w-0.5 bg-gradient-to-b from-primary to-accent" />
          )}
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-white font-bold shadow-lg">
            {index + 1}
          </div>
          <div className="pt-1">
            <h4 className="font-semibold text-lg">{step.title}</h4>
            <p className="mt-1 text-muted-foreground">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
