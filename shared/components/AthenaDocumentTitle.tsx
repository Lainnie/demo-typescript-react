import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

const AthenaDocumentTitle = ({ pageName, children }: {pageName?: string, children?: React.ReactNode}) => {
    const appName = 'ERMS Olympus';
    const pageTitle = (pageName && `${pageName} | ${appName}`) || appName;
    return (
        // import/export issue in react-document-title package
        // https://github.com/gaearon/react-document-title/issues/58
        // @ts-ignore : TS2604: JSX element type 'DocumentTitle' does not have any construct or call signatures
        <DocumentTitle title={pageTitle}>
            {children}
        </DocumentTitle>
    )
};

export default AthenaDocumentTitle;