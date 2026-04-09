import { http } from '../utils/http'

export const dashboardService = {
  getSummary: () => http.get('/dashboard/summary'),
  getRevenueChart: (days = 7) => http.get(`/dashboard/revenue-chart?days=${days}`),
  getAlerts: () => http.get('/dashboard/alerts'),
}
