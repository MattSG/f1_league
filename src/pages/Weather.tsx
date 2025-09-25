import MemeBackdrop from '../components/MemeBackdrop'
import WeatherPicker from '../components/WeatherPicker'

export default function Weather() {
  return (
    <main className="relative">
      <MemeBackdrop />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10">
        <WeatherPicker />
      </div>
    </main>
  )
}
