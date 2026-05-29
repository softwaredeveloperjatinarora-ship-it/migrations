
import { useEffect, useRef, useState } from "react"

export default function LazySectionWrapper({
  children,
  placeholderHeight = 300, // Estimated height to prevent layout shift
}: {
  children: React.ReactNode
  placeholderHeight?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (ref.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setIsVisible(true)

            observerRef.current?.unobserve(entry.target)
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.6,
        }
      )

      observerRef.current.observe(ref.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div ref={ref} style={{ minHeight: isVisible ? undefined : placeholderHeight }}>
      {isVisible ? children : null}
    </div>
  )
}
