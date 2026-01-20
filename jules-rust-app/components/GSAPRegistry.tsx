"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
    ScrollTrigger,
    ScrollToPlugin,
    ScrollSmoother,
    Flip,
    Draggable,
    Observer,
    InertiaPlugin,
    MotionPathPlugin,
    MotionPathHelper,
    TextPlugin,
    SplitText,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    MorphSVGPlugin,
    Physics2DPlugin,
    PhysicsPropsPlugin,
    GSDevTools,
    CustomEase,
    CustomBounce,
    CustomWiggle,
    EasePack,
    CSSRulePlugin,
    EaselPlugin,
    PixiPlugin
} from "gsap/all";

export default function GSAPRegistry() {
    useLayoutEffect(() => {
        gsap.registerPlugin(
            useGSAP,
            ScrollTrigger,
            ScrollToPlugin,
            ScrollSmoother,
            Flip,
            Draggable,
            Observer,
            InertiaPlugin,
            MotionPathPlugin,
            MotionPathHelper,
            TextPlugin,
            SplitText,
            ScrambleTextPlugin,
            DrawSVGPlugin,
            MorphSVGPlugin,
            Physics2DPlugin,
            PhysicsPropsPlugin,
            GSDevTools,
            CustomEase,
            CustomBounce,
            CustomWiggle,
            EasePack,
            CSSRulePlugin,
            EaselPlugin,
            PixiPlugin
        );
    }, []);

    return null;
}
