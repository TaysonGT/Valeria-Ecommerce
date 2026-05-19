import {motion, Variants} from 'framer-motion'
import React from 'react';

interface SpinnerProps {
    size?: number;
    color?: string;
    speed?: number;
    thickness?: number;
    className?: string;
}

const Loader: React.FC<SpinnerProps> = ({
    size = 24,
    color = '#000000',
    speed = 1,
    thickness = 4,
    className = "",
})=>{

    const loaderVariants: Variants = {
        animationSpin: {
            rotate: 360,
            transition: {
                duration: speed,
                repeat: Infinity,
                ease: 'linear'
            }
        }
    }

    return(
        <motion.div className={className}
        style={{
            width: size,
            height: size,
            border: `${thickness}px solid rgba(0,0,0,0.1)`,
            borderTop: `${thickness}px solid ${color}`,
            borderRadius: "50%"
        }}
        variants={loaderVariants}
        animate="animationSpin"
        />
    )
}

export default Loader