import { motion } from "framer-motion"
import { Mail, Phone} from "lucide-react"

export default function ThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 max-w-2xl"
      >
        <motion.h1
          className="text-6xl font-bold mb-4 text-blue-600"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          Thank You!
        </motion.h1>
        <motion.p
          className="text-xl mb-8 text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We have received your response and will get back to you shortly!
        </motion.p>
        <motion.div
          className="bg-blue-50 rounded-xl p-6 shadow-lg border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Contact Information</h2>
          <div className="space-y-4 text-blue-600">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>blzitsolutionsofficial@gmail.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91-9627997848</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91-9027519366</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>+91-9520106946</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

