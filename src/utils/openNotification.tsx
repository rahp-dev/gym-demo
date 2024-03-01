import { toast, Notification } from '@/components/ui'

export default function openNotification(
  type: 'success' | 'warning' | 'danger' | 'info',
  title: string,
  text: string,
  duration: number = 5
) {
  toast.push(
    <Notification title={title} type={type} duration={duration * 1000}>
      {text}
    </Notification>,
    { placement: 'top-center' }
  )
}
