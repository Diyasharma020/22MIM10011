import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material'

interface Notification {
  ID: string
  Type: 'Placement' | 'Result' | 'Event'
  Message: string
  Timestamp: string
}

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      // replace this later with your real token
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkaXlhc2hhcm1hMjAyMkB2aXRiaG9wYWwuYWMuaW4iLCJleHAiOjE3Nzg5Mjg0ODcsImlhdCI6MTc3ODkyNzU4NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImY5OTcwMDMwLWIxMDYtNDkyZi1hZDkxLWUwODc4MWYyMDJiMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImRpeWEgc2hhcm1hIiwic3ViIjoiODUxOWQ2OGMtZDE2NC00NjI1LWEyZWItOGJlZTBkOGY2NDk3In0sImVtYWlsIjoiZGl5YXNoYXJtYTIwMjJAdml0YmhvcGFsLmFjLmluIiwibmFtZSI6ImRpeWEgc2hhcm1hIiwicm9sbE5vIjoiMjJtaW0xMDAxMSIsImFjY2Vzc0NvZGUiOiJTZkZ1V2ciLCJjbGllbnRJRCI6Ijg1MTlkNjhjLWQxNjQtNDYyNS1hMmViLThiZWUwZDhmNjQ5NyIsImNsaWVudFNlY3JldCI6IkZRVVlueXN3QkN1dVVoeVoifQ.3b-6RgiNZZSFu-S8qXRtJ2CwcMUtE-LRz7omYB07wCM"

      const response = await axios.get(
        'http://4.224.186.213/evaluation-service/notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const sorted = response.data.notifications.sort(
        (a: Notification, b: Notification) => {
          const weight: any = {
            Placement: 3,
            Result: 2,
            Event: 1,
          }

          if (weight[b.Type] !== weight[a.Type]) {
            return weight[b.Type] - weight[a.Type]
          }

          return (
            new Date(b.Timestamp).getTime() -
            new Date(a.Timestamp).getTime()
          )
        }
      )

      setNotifications(sorted.slice(0, 10))
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" mb={4}>
        Campus Notifications
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        notifications.map((notification) => (
          <Card key={notification.ID} sx={{ mb: 2 }}>
            <CardContent>
              <Typography fontWeight="bold">
                {notification.Type}
              </Typography>

              <Typography>
                {notification.Message}
              </Typography>

              <Typography variant="body2">
                {notification.Timestamp}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  )
}

export default App