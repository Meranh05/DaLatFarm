import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { Editor } from '@tinymce/tinymce-react'
import { Plus, Edit, Trash2, X, Calendar, Image as ImageIcon } from 'lucide-react'
import { createPortal } from 'react-dom'
import { db } from '../../config/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { newsAPI, uploadAPI } from '../../services/apiService'

const AdminNews = () => {
  return (
    <div className="p-6 text-sm text-gray-600">Tính năng Tin tức đợi phát triển.</div>
  )
}

export default AdminNews


