import type { FC } from 'react'
import styles from './controller-docs.module.css'

export type Locale = 'en' | 'zh'
export type LocalizedText = Readonly<Record<Locale, string>>

export type ApiRow = Readonly<{
  name: string
  type: string
  defaultValue: string
  description: LocalizedText
  required?: boolean
}>

export type ApiSection = Readonly<{
  name: string
  inherited: LocalizedText
  rows: readonly ApiRow[]
}>

export type DataAttribute = Readonly<{
  description: LocalizedText
  name: string
  values?: string
}>

export const localizedText = (en: string, zh: string): LocalizedText => ({ en, zh })

const labels = {
  en: {
    attribute: 'Data Attributes',
    defaultValue: 'Default',
    description: 'Description',
    name: 'Prop',
    required: 'required',
    type: 'Type',
  },
  zh: {
    attribute: 'Data 属性',
    defaultValue: '默认值',
    description: '说明',
    name: '属性',
    required: '必填',
    type: '类型',
  },
} as const

type ApiTableProps = Readonly<{
  lang: Locale
  section: ApiSection
}>

type DataAttributesProps = Readonly<{
  attributes: readonly DataAttribute[]
  component: string
  lang: Locale
}>

export const DataAttributes: FC<DataAttributesProps> = ({ attributes, component, lang }) => {
  if (attributes.length === 0) return null

  return (
    <section data-data-attributes={component}>
      <h3>{labels[lang].attribute}</h3>
      <dl>
        {attributes.map((attribute) => (
          <div key={attribute.name}>
            <dt>
              <code>{attribute.name}</code>
              {attribute.values && (
                <>
                  {' '}
                  — <code>{attribute.values}</code>
                </>
              )}
            </dt>
            <dd>{attribute.description[lang]}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export const ApiTable: FC<ApiTableProps> = ({ lang, section }) => {
  const localeLabels = labels[lang]

  return (
    <section className={styles.apiSection} aria-labelledby={`${section.name}-api`}>
      <h3 className={styles.apiHeading} id={`${section.name}-api`}>
        {section.name}
      </h3>
      <p className={styles.apiInherited}>{section.inherited[lang]}</p>
      {section.rows.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.apiTable}>
            <caption className={styles.visuallyHidden}>
              {section.name} {lang === 'zh' ? '公开属性' : 'public props'}
            </caption>
            <thead>
              <tr>
                <th scope="col">{localeLabels.name}</th>
                <th scope="col">{localeLabels.description}</th>
                <th scope="col">{localeLabels.type}</th>
                <th scope="col">{localeLabels.defaultValue}</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.name}>
                  <td className={styles.propName} data-label={localeLabels.name}>
                    <code>{row.name}</code>
                    {row.required && (
                      <span className={styles.required} title={localeLabels.required}>
                        *
                      </span>
                    )}
                  </td>
                  <td data-label={localeLabels.description}>{row.description[lang]}</td>
                  <td data-label={localeLabels.type}>
                    <code>{row.type}</code>
                  </td>
                  <td data-label={localeLabels.defaultValue}>
                    <code>{row.defaultValue}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
