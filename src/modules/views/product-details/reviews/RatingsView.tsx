"use client"
import Modal from '@/modules/lib/components/modal/modal'
import useReviews from '@/modules/lib/utility/hooks/use-review'
import React, { useState } from 'react'
import { AddReview } from './AddReview'

const RatingsView = ({ id }: { id: number }) => {
    const { reviews, allReviews, reviewStat, reviewStatDist } = useReviews(id)
    const [openModal, setOpenModal] = useState<boolean>(false)
    return (
        <>
            <div>
                <button onClick={() => setOpenModal(true)}>Add review</button>
            </div>
            <Modal isOpen={openModal} onClose={() => { setOpenModal(false) }}>
                <AddReview id={id} />
            </Modal>
        </>
    )
}

export default RatingsView
