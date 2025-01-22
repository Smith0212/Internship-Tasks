import express from 'express';
import { addPlace, getPlaces, getPlaceDetails, getPlaceReviews, addReview } from '../controllers/post.js';

const router = express.Router();

router.post('/', addPlace);                    
router.get('/', getPlaces);                   
router.get('/:id', getPlaceDetails);
router.get('/:id/reviews', getPlaceReviews);         
router.post('/:id/reviews', addReview);        

export default router;
