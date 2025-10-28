// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import classNames from 'classnames';

import { usePreviewTableStore } from '../../store';
import { isElementInContainer } from '../../utils/element';
import { ResultItemRender } from '../ResultItemRender';
import { CustomChange } from './custom-change';
import styles from './index.module.scss';
import { openFullScreenModal } from '@common/components/FullscreenModal';

function CloseIcon({ onClose }: { onClose: () => void }) {
  return (
    <Button
      icon={<IconClose />}
      style={{
        width: 40,
        height: 40,
        position: 'absolute',
        right: 36,
        top: 36,
      }}
      shape="circle"
      onClick={() => onClose()}
    />
  );
}

const DomKey = 'modal-preview-extra-item';

function GroupResultPreview({ onClose }: { onClose: () => void }) {
  const preview = usePreviewTableStore((s) => s.preview);

  const [showIndex, setShowIndex] = useState(0);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const RenderExtra = useMemo(
    () => (
      <>
        <div className={styles.extra} ref={scrollContainer}>
          {preview!.map((item, index) => (
            <div
              key={item.url}
              className={classNames({
                [styles.extraImage]: true,
                [styles.extraActive]: showIndex === index,
              })}
              id={`${DomKey}-${index}`}
              onClick={() => {
                if (index !== showIndex) {
                  setShowIndex(index);
                }
              }}
            >
              <ResultItemRender
                result={item}
                onClose={onClose}
                renderMode="clean"
                objectFit="cover"
                isMulti
                withCustomChange={false}
              />
            </div>
          ))}
        </div>
        <CustomChange isMulti />
      </>
    ),
    [onClose, preview, showIndex],
  );

  useEffect(() => {
    const MaxLength = preview!.length;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        // 当前内部下一张
        setShowIndex((v) => {
          const newV = v + 1;
          if (newV >= MaxLength) {
            return 0;
          }
          return newV;
        });
        e.stopImmediatePropagation();
        return;
      }
      if (e.code === 'ArrowUp') {
        // 当前内部上一张
        setShowIndex((v) => {
          const newV = v - 1;
          if (newV < 0) {
            return MaxLength - 1;
          }
          return newV;
        });
        e.stopImmediatePropagation();
        return;
      }
    };

    window.addEventListener('keydown', handleKeydown, true);
    return () => {
      window.removeEventListener('keydown', handleKeydown, true);
    };
  }, [preview]);

  useEffect(() => {
    const el = document.getElementById(`${DomKey}-${showIndex}`);
    const container = scrollContainer.current;
    if (el && container) {
      const isInView = isElementInContainer(el, container);

      if (!isInView) {
        const t = el.offsetTop - container.scrollTop - el.offsetHeight;
        const b =
          el.offsetTop +
          el.offsetHeight -
          container.scrollTop -
          container.clientHeight;
        if (t < 0) {
          container.scrollTo({
            top: Math.max(el.offsetTop - 10, 0),
          });
          return;
        } else if (b > 0) {
          // 在下方
          container.scrollTo({
            top: Math.max(
              el.offsetTop - container.clientHeight + el.offsetHeight + 10,
              0,
            ),
          });
          return;
        }
      }
    }
  }, [showIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.resource}>
          <ResultItemRender
            objectFit="contain"
            result={preview![showIndex]}
            onClose={onClose}
            extra={RenderExtra}
            isMulti
            withCustomChange={false}
          />
        </div>
      </div>
      <CloseIcon onClose={onClose} />
    </div>
  );
}

export function ModalPreview({ onClose }: { onClose: () => void }) {
  const preview = usePreviewTableStore((s) => s.preview);
  if (!preview) {
    return null;
  }
  // 单个结果;
  if (preview.length === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.resource}>
          <ResultItemRender
            result={preview[0]}
            onClose={onClose}
            renderMode="full"
          />
        </div>
        <CloseIcon onClose={onClose} />
      </div>
    );
  }

  // 多张图
  return <GroupResultPreview onClose={onClose} />;
}

export const openPreviewModal = ({ onClose }: { onClose?: () => void }) => {
  const handleClose = () => {
    closeModal();
    onClose && onClose();
  };

  const closeModal = openFullScreenModal(
    <ModalPreview onClose={handleClose} />,
  );
};
