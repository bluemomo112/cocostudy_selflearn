'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Share2, Copy, Check, BarChart3, Download } from 'lucide-react';
import { PublishScope, PublishMetadata } from '../types/self-study';
import { useLanguage } from '../contexts/LanguageContext';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (metadata: PublishMetadata, scope: PublishScope) => void;
  isPublished: boolean;
  shareLink?: string;
  currentSpaceName?: string;
}

const GRADES = ['中一', '中二', '中三', '中四', '中五', '中六'];

const SUBJECTS = ['中文', '數學', '英文', '科學', '物理', '化學', '生物', '歷史', '地理', '通識', '音樂', '美術', '體育', '資訊科技'];

const MOCK_CLASSES = [
  '中一(1)班', '中一(2)班',
  '中二(1)班', '中二(2)班',
  '中三(1)班', '中三(2)班',
  '中四(1)班', '中四(2)班',
];

export default function PublishModal({
  isOpen,
  onClose,
  onPublish,
  isPublished,
  shareLink,
  currentSpaceName,
}: PublishModalProps) {
  const [metadata, setMetadata] = useState<PublishMetadata>({
    spaceName: currentSpaceName || '',
    isAnonymous: false,
    grade: undefined,
    subjects: [],
    bindClasses: [],
    chapter: undefined,
    sourceTestId: undefined,
    sourceTestName: undefined,
  });
  const [scope, setScope] = useState<PublishScope>({
    includeResources: true,
    includeTasks: true,
    includeAISettings: true,
    includeLearningPath: true,
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(isPublished);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  if (!isOpen) return null;

  // 生成6位隨機訪問碼
  const generateAccessCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const autoSpaceName = metadata.sourceTestId && metadata.sourceTestName
        ? `${metadata.sourceTestName} - 學習空間`
        : metadata.spaceName;
      const publishData = {
        ...metadata,
        spaceName: autoSpaceName,
        accessCode: metadata.isAnonymous ? generateAccessCode() : undefined,
      };
      await onPublish(publishData, scope);
      setMetadata(publishData);
      setShowSuccess(true);
    } catch (error) {
      console.error('發布失敗:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyCodeToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const downloadQRCode = useCallback(() => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement('a');
      a.download = `qrcode-${metadata.spaceName || 'space'}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [metadata.spaceName]);

  const toggleSubject = (subject: string) => {
    setMetadata({
      ...metadata,
      subjects: metadata.subjects?.includes(subject)
        ? metadata.subjects.filter(s => s !== subject)
        : [...(metadata.subjects || []), subject],
    });
  };

  const toggleClass = (className: string) => {
    setMetadata({
      ...metadata,
      bindClasses: metadata.bindClasses?.includes(className)
        ? metadata.bindClasses.filter(c => c !== className)
        : [...(metadata.bindClasses || []), className],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="text-primary-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">
              {isPublished ? '重新發布學習空間' : '發布學習空間'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showSuccess ? (
            <>
              {/* 學習空間名稱 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  學習空間名稱
                </label>
                <input
                  type="text"
                  value={metadata.spaceName || ''}
                  onChange={(e) => setMetadata({ ...metadata, spaceName: e.target.value })}
                  placeholder="請輸入學習空間名稱"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* 發布信息 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  發布信息
                </label>
                <div className="space-y-4">
                  {/* 年級選擇 */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">年級</label>
                    <select
                      value={metadata.grade || ''}
                      onChange={(e) => setMetadata({ ...metadata, grade: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">請選擇年級（可選）</option>
                      {GRADES.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 章節輸入 */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">章節（可選）</label>
                    <input
                      type="text"
                      value={metadata.chapter || ''}
                      onChange={(e) => setMetadata({ ...metadata, chapter: e.target.value })}
                      placeholder="例如：第三章 流體壓強"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* 學科多選 */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">學科</label>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => toggleSubject(subject)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            metadata.subjects?.includes(subject)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 匿名模式開關 */}
                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <div className="text-sm font-medium text-gray-700">匿名模式</div>
                        <div className="text-xs text-gray-500 mt-1">
                          開啟後，學生無需綁定班級，使用訪問碼即可進入
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={metadata.isAnonymous || false}
                          onChange={(e) => {
                            setMetadata({
                              ...metadata,
                              isAnonymous: e.target.checked,
                              bindClasses: e.target.checked ? [] : metadata.bindClasses
                            });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </div>
                    </label>
                  </div>

                  {/* 班級多選 */}
                  {!metadata.isAnonymous && (
                    <div>
                    <label className="block text-xs text-gray-600 mb-2">綁定班級</label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                      <div className="space-y-2">
                        {MOCK_CLASSES.map((className) => (
                          <label
                            key={className}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={metadata.bindClasses?.includes(className)}
                              onChange={() => toggleClass(className)}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{className}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* 發布範圍配置 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  發布範圍
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scope.includeResources}
                      onChange={(e) => setScope({ ...scope, includeResources: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">學習資源</div>
                      <div className="text-sm text-gray-600">包含所有上傳的文檔、視頻等資源</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scope.includeTasks}
                      onChange={(e) => setScope({ ...scope, includeTasks: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">學習任務</div>
                      <div className="text-sm text-gray-600">包含所有配置的學習任務和練習</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scope.includeAISettings}
                      onChange={(e) => setScope({ ...scope, includeAISettings: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">AI 設置</div>
                      <div className="text-sm text-gray-600">包含 AI 風格、知識邊界等配置</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scope.includeLearningPath}
                      onChange={(e) => setScope({ ...scope, includeLearningPath: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">學習路徑</div>
                      <div className="text-sm text-gray-600">包含 AI 生成的學習路徑規劃</div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 發布成功 */}
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('發布成功！')}
                </h3>
                <p className="text-gray-600">
                  {t('學習空間已成功發布，你可以分享給學生了')}
                </p>
              </div>

              {/* 二維碼 */}
              <div className="flex flex-col items-center">
                <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
                  <svg
                    ref={qrRef}
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="160" height="160" fill="white" />
                    {/* QR 定位角 - 左上 */}
                    <rect x="8" y="8" width="40" height="40" rx="4" fill="none" stroke="#16a34a" strokeWidth="4" />
                    <rect x="16" y="16" width="24" height="24" rx="2" fill="#16a34a" />
                    {/* QR 定位角 - 右上 */}
                    <rect x="112" y="8" width="40" height="40" rx="4" fill="none" stroke="#16a34a" strokeWidth="4" />
                    <rect x="120" y="16" width="24" height="24" rx="2" fill="#16a34a" />
                    {/* QR 定位角 - 左下 */}
                    <rect x="8" y="112" width="40" height="40" rx="4" fill="none" stroke="#16a34a" strokeWidth="4" />
                    <rect x="16" y="120" width="24" height="24" rx="2" fill="#16a34a" />
                    {/* 中間數據區域模擬 */}
                    {[56, 64, 72, 80, 88, 96, 104].map((x) =>
                      [56, 64, 72, 80, 88, 96, 104].map((y) => (
                        <rect
                          key={`${x}-${y}`}
                          x={x}
                          y={y}
                          width="6"
                          height="6"
                          fill={(x + y) % 16 === 0 || (x * y) % 13 < 5 ? '#16a34a' : 'transparent'}
                        />
                      ))
                    )}
                    {/* 散佈的數據點 */}
                    {[
                      [56, 16], [64, 24], [72, 16], [80, 32], [88, 24], [96, 16],
                      [56, 32], [72, 40], [88, 40], [96, 32],
                      [16, 56], [24, 64], [32, 72], [16, 80], [24, 88], [32, 96],
                      [40, 64], [40, 80], [40, 96],
                      [112, 56], [120, 64], [128, 72], [136, 80], [120, 88], [128, 96],
                      [16, 104], [24, 104], [56, 112], [64, 120], [72, 128],
                      [80, 112], [88, 120], [96, 128], [104, 112],
                      [112, 112], [120, 120], [128, 128], [136, 136], [144, 120],
                    ].map(([x, y]) => (
                      <rect key={`d-${x}-${y}`} x={x} y={y} width="6" height="6" fill="#16a34a" />
                    ))}
                  </svg>
                </div>
                <button
                  onClick={downloadQRCode}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14} />
                  {t('下載二維碼')}
                </button>
              </div>

              {/* 分享信息 */}
              <div className="space-y-4">
                {/* 測驗鏈接 + 複製 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('分享鏈接')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareLink || ''}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => shareLink && copyToClipboard(shareLink)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                      {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                      {copiedLink ? t('已複製') : t('複製')}
                    </button>
                  </div>
                </div>

                {/* 課程碼 + 複製（僅匿名模式） */}
                {metadata.isAnonymous && metadata.accessCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('課程碼')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={metadata.accessCode}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono text-lg tracking-wider text-center"
                      />
                      <button
                        onClick={() => metadata.accessCode && copyCodeToClipboard(metadata.accessCode)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                      >
                        {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                        {copiedCode ? t('已複製') : t('複製')}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {t('學生需要輸入此課程碼才能進入學習空間')}
                    </p>
                  </div>
                )}
              </div>

              {/* 提示 */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <BarChart3 size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">
                      {metadata.isAnonymous ? t('學生可以匿名訪問學習空間') : t('學生可以訪問學習空間')}
                    </p>
                    <p className="text-blue-700">
                      {metadata.isAnonymous
                        ? t('學生打開鏈接並輸入訪問碼後，需要輸入姓名即可進入學習空間')
                        : t('學生打開鏈接後可以從班級名錄中選擇自己的姓名登錄')}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          {!showSuccess ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('取消')}
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? t('發布中...') : isPublished ? t('重新發布') : t('發布')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('繼續發布到其他班級')}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {t('完成')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
