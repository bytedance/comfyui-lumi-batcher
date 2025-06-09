// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useRef, useState } from 'react';

export const useInView = <T extends Element>(): [
  React.RefObject<T>,
  boolean,
] => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        });
      },
      {
        root: null, // 使用视窗作为根
        rootMargin: '0px',
        threshold: 0.1, // 元素至少有10%可见时触发
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, visible];
};

export const useInViewOnce = <T extends Element>(): [
  React.RefObject<T>,
  boolean,
] => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (ref.current) {
              observer.disconnect();
            }
          }
        });
      },
      {
        root: null, // 使用视窗作为根
        rootMargin: '0px',
        threshold: 0.1, // 元素至少有10%可见时触发
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, visible];
};
