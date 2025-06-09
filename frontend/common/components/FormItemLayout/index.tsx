// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import styles from './index.module.scss';

interface FormItemLayoutProps {
  label: string;
  content: React.ReactNode;
}
export const FormItemLayout: React.FC<FormItemLayoutProps> = ({
  label,
  content,
}) => (
  <div className={styles.formItemLayout}>
    <p className={styles.formItemLayoutLabel}>{label}</p>
    <div>{content}</div>
  </div>
);
